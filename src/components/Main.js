import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                        <div className="content mr-auto ml-auto">
                            <p>&nbsp;</p>
                            {/* On submit handler to listen to events on react. */}
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                {/* postContent will be read from ref. */}
                                const content = this.postContent.value
                                this.props.createPost(content)
                            }}>
                                {/* Form to input content. */}
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="postContent"
                                        type="text"
                                        {/* Ref to get content from input. */}
                                        ref={(input) => { this.postContent = input }}
                                        className="form-control"
                                        placeholder="What's on your mind?"
                                        required />
                                </div>
                                {/* Button to submit. */}
                                <button type="submit" className="btn btn-primary btn-block">Share</button>
                            </form>
                            <p>&nbsp;</p>
                            // Loops through all the post.
                            { this.props.posts.map((post, key) => {
                            return(
                                <div className="card mb-4" key={key}>
                                <div className="card-header">
                                    // Post author appears at header of the card.
                                    <img 
                                    className='mr-2'
                                    width='30'
                                    height='30'
                                    src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                                    />
                                    <small className="text-muted">{post.author}</small>
                                </div>
                                <ul id="postList" className="list-group list-group-flush">
                                    <li className="list-group-item">
                                    {/* Post content appears under body of card. */}
                                    <p>{post.content}</p>
                                    </li>
                                    <li key={key} className="list-group-item py-2">
                                    <small className="float-left mt-1 text-muted">
                                        {/* Tips fall under footer of card. */}
                                        TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                                    </small>
                                    {/* On click handler to call functions. */}
                                    <button 
                                        className="btn btn-link btn-sm float-right pt-0"
                                        {/* Obtain the post id. */}
                                        name={post.id}
                                        onClick={(event) => {
                                            {/* Set tip amount to always be 0.1 Ether. */}
                                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                                            {/* Pass in id and tip amount to the function. */}
                                            this.props.tipPost(event.target.name, tipAmount)
                                        }}
                                    >
                                        TIP 0.1 ETH
                                    </button>
                                    </li>
                                </ul>
                                </div>
                            )
                            })}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default Main;