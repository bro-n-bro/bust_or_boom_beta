# BustOrBoom

**BustOrBoom** is a Telegram game that lets users place bets on whether the price of ATOM will rise or fall. The core of our project revolves around leveraging prediction markets to drive engagement and enhance the utility of ATOM. We have deployed two contracts on the `pion-1` network, based on the Velo contracts:

1. **Game Contract**: Handles the game mechanics and user bets.
2. **Game Center Contract**: Manages the user profiles and connects multiple games.

### Key Features

- **ATOM Betting**: Users can predict the rise or fall of ATOM's price, making it the centerpiece of our application and emphasizing ATOM's utility.
- **Custom Token for Bets**: We've launched our own token, which is currently the only currency for placing bets. In the future, users will also be able to bet directly with ATOM, enhancing its utility and adoption.
- **Price Oracle**: We use **Slinky/Oracle by Skip** to fetch real-time price data for determining the outcome of each bet, ensuring accuracy and reliability.
- **JetWallet Integration**: All transactions are seamlessly signed and broadcasted via **JetWallet**, which also provides secure key management for user accounts.
- **Faucet Integration**: To ensure a smooth user experience, we created a faucet that distributes tokens for betting and gas fees, making it accessible for everyone.
- **Bot Army**: To keep the game engaging and dynamic, we've written a bot army that randomly places bets, ensuring the game remains active and fun for users.

### Future Plans

We aim to:
- Enhance gameplay mechanics.
- Introduce additional prediction markets.
- Enable direct betting with ATOM to further boost its utility and adoption.
- Explore other innovative features to attract new users and increase transactional activity on the blockchain.

### Screenshots

![Screenshot at Dec 08 11-12-59.png](https://cdn.dorahacks.io/static/files/193a5c2d3b7538d0d0d4f67447bb544c.png)

### References

- [BustOrBoom app](https://t.me/bust_or_boom_bot)
- [jetWallet beta](https://t.me/cosmos_wallet_bot)
