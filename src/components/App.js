import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'

// React component
class App extends Component {

  // Whenever component is mount to dom, web3 have to be loaded before proceeding further.
  async componentWillMount() {
    await this.loadWeb3()
    // Loads blockchain data after web3 is loaded.
    await this.loadBlockchainData()
  }

  // Load our connection to blockchain.
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // Get web3 connection
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    // Assign the first account to the state
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    /* Fetch the network data, if that information exists, instantiate the smart contract with web3.js
    or else show that smart contract is not deployed to blockchain. */
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      // Save a copy of this on the react state object so we can use the smart contracts later.
      this.setState({ socialNetwork })
      // To retrieve the post count.
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      /* Load Posts 
      Using a  for loop to lopp through every single number from 1 up to the complete number of posts. */
      for(var i =1; i <= postCount; i++) {
        // Fetch the post from blockchain
        const post = await socialNetwork.methods.posts(i).call()
        // Store it inside a state
        this.setState({
          // Creates a new array, and uses the old post and add the new post to the array.
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      // Whenever loading from blockchain is done, content will be shown on the page.
      this.setState({ loading: false })
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  // Call smart contract createPost function by using web3.js
  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  // Call smart contract tipPost function by using web3.js
  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    }) 
  }

  // Defining state inside our component.
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }

    // Binding the functions
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  render() {
    return (
      <div>
        // Shows the account connected to blockchain.
        <Navbar account={this.state.account} />
        // If its loading display "Loading..." text, or else display content.
        { this.state.loading 
          ? <div id ="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main 
              posts={this.state.posts}
              createPost={this.createPost}
              tipPost={this.tipPost}
            />
        }
      </div>
    );
  }
}

export default App;
