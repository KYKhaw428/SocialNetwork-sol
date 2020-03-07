/* Testing is critical as we need to ensure that our smart contract is flawless before we
 deploy it to the blockchain, you can't update smart contract codes once it is on the blockchain.
 Smart contract is immutable, therefore we need to ensure we don't have any bug 
 before we put them on the blockchain. */

// Import smart contract similar to migration file
const SocialNetwork = artifacts.require('./SocialNetwork.sol')

// Require Chai Assertion Library
require('chai')
    .use(require('chai-as-promised'))
    .should()

// Setup by specifying different accounts will be used for testing in an array.
contract('SocialNetwork', ([deployer, author, tipper]) => {
    // variable used to represent deployed smart contract
    let socialNetwork

    // Create an instance of socialNetwork and reduce duplication instance as more tests are built.
    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })

    // Test if deployment is successful by checking if address exists.
    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        // Test example if name exists.
        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'KKY Social Network')
        })
    })

    // List of social network functions written in test.
    describe('posts', async () => {
        let result, postCount

        // Track result and postCount so these values can be used in list posts and and tip post test.
        before(async () => {
            result = await socialNetwork.createPost('This is my first post', { from: author })
            postCount = await socialNetwork.postCount()
        })
        
        // Test if post is created in the example below.
        it('create posts', async () => {
            // SUCCESS
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            // FAILURE: Post must have content
            await socialNetwork.createPost('', { from: author }).should.be.rejected;
        })

        // Test if example post is listed and contains the correct values.
        it('lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'This is my first post', 'content is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })
        
        // Test if post can be tipped.
        it('allow users to tip posts', async () => {
            // Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

            // SUCCESS
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            // Check that author received funds
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            // Factor tip amount.
            let tipAmount
            tipAmount = web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            // Formula to make sure that author balance have increased.
            const expectedBalance = oldAuthorBalance.add(tipAmount)

            // Author's new balance should be equal to expected balance.
            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            // FAILURE: Tries to tip a post that does not exist
            await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        })
        
    })
})