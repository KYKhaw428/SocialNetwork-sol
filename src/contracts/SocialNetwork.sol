// Tells the file what version of solidity to use, in this case its 0.5.0 or greater.
pragma solidity ^0.5.0;

// Smart contract creation
contract SocialNetwork {
    /* A state variable that belongs to the entire smart contract, 
    and its value will get written and stored on the blockchain. 
    Making it public so that users can read this variable value for free on the blockchain. */
    string public name;
    // Keep track of the posts that is added to the mapping.
    uint public postCount = 0;
    /* A key-value pair to write and store data on the blockchain. 
    Works like an associative array or a hashtable.
    In this case, key = uint & value = Post(which originates from the struct).
    Mapping is then referred to as "posts". */ 
    mapping(uint => Post) public posts;

    // Creating data structure and defining all the atrributes for the post.
    struct Post {
        // uint referring to unsigned integer and cannot be -1 for example.
        uint id;
        string content;
        uint tipAmount;
        // Keeps track of post author's ethereum address
        address payable author;
    }

    /* Creating event to track the values stored inside the post. 
    Event can be triggered from solidity smart contracts, and subscribe to/by external consumers.
    External consumers can listen to the event and get information from event,
    and do stuff with the information.
    Therefore, in our test: 1) We subscribe to the event
    2) Read its values and check that the data is correct if it matches exactly in the post. */
    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    /* A function that runs whenever this smart contract is being deployed on the blockchain.
    Making it public so that it is accessible to the public interface for the smart contract.*/
    constructor() public {
        name = "KKY Social Network";
    }

    /* Function to create post
    Takes in _content as an arguement and its a local variable with an underscore 
    infront of it insead of a state variable.
    Using memory modifier that solidity requires. */
    function createPost(string memory _content) public {
        /* Require valid content
        To make sure the post is not empty. */
        require(bytes(_content).length > 0, 'Unable to post empty content');
        /* Increment the post count.
        Used as an Id for the posts as well.*/ 
        postCount ++;
        /* Create the post
        Puts the post in the mapping by using Id as the key, and the values of the post with struct format. */
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        /* Trigger event 
        To track values that are stored inside the post. */
        emit PostCreated(postCount, _content, 0, msg.sender);
        }

    /* Function to tip post 
    Takes the id of the post we want to issue the tip for. */
    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount, 'Post is not valid to be tipped');
        /* Fetch the post
        Fetch the post out from the blockchain via mapping.
        Create a new copy of it and update the values but not affecting the post on the blockchain. */
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Inrement the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        /* Update the post
        by putting it back on the blockchain. */
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
        }
}