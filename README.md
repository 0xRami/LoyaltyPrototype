# Loyalty Token Project

This prototype demonstrates a Web3-enabled loyalty and gamification system for a fashion platform. It integrates blockchain technology, tokenized loyalty points, and gamification features and reward customers for their purchases.

The system includes:
1. **Tokenized Loyalty Points**: Earn loyalty points for purchases and tokenize them as an ERC-20 token.
2. **Gamification**: Dynamic tier-based loyalty rewards and activity-based multipliers.
3. **Crypto Conversion**: Convert loyalty points into cryptocurrencies (e.g., USDT, ETH) and withdraw them.

## Gamification

Tier System:

    Bronze: 0-9 orders per month.
    Silver: 10-19 orders per month (earn 1.2x points).
    Gold: 20+ order per month (earn 1.5x points and exclusive offers).

Reward Multiplier:

    Double points for purchases above $100.

## Project Structure

```
root/
├── backend/                # Backend codebase for APIs and services
│   ├── config/             # Configuration files (e.g., tier thresholds, conversion rates)
│   ├── controllers/        # API route controllers handling business logic
│   ├── models/             # MongoDB schemas for users, orders, etc.
│   ├── routes/             # API route definitions for tokens, orders, and withdrawals
│   ├── services/           # Reusable business logic (e.g., tier updates, token services)
│   ├── utils/              # Utility functions (e.g., Web3 provider, reward calculation)
├── contracts/              # Solidity smart contracts (e.g., ERC-20 token implementation)
├── ignition/               # Hardhat deployment scripts and modules
├── node_modules/           # Node.js dependencies
├── test/                   # Unit tests for backend services and smart contracts
```

## Deployment and Integration details
This prototype is deployed on the Sepolia Ethereum Testnet. The Loyalty Token (ERC-20) contract is live on the network, and its details can be found [here](https://sepolia.etherscan.io/address/0x3194c32bfed0fe1dc5e55df975019ef6556304eb).

### Swap Mechanism
To enable seamless swapping between the ERC-20 `LoyaltyToken` and `USDT` or `ETH`, this prototype integrates with Uniswap V3, utilizing the `SwapRouter002` contract. Additionally, a custom smart contract, `TokenSwap`, has been developed to manage the integration with Uniswap.
### Infrastructure and Connections
1. **Alchemy RPC**:
The prototype leverages Alchemy's RPC interaction with the Ethereum blockchain.
2. **Database**:
A `MongoDB` instance, hosted on MongoDB Atlas, is used to store and manage application data.

Using mongodb deployed on atlas instance 
## Get Started

### Prerequisites
- Node.js (v22.11.0 or later)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/0xRami/LoyaltyPrototype
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Configure Environment Variables:
    Create a `.env` file in the project root with the values shared with you privately.
4. Start the application:
   ```
   npm start
   ```
## Testing

1. Create an user.
2. Place an order and earn loyalty points.
   1. Place more than 10 orders to be promoted to the silver tier, and more than 20 orders to be promoted to the gold tier.
   2. Place an order with an amount above $100 to receive multiplied points.
3. Check loyalty tokens balance
4. Create a MetaMask wallet to test withdrawals.
5. Withdraw loyalty tokens as USDT or ETH.
6. Simulate a fiat-to-crypto withdrawal as USDT.

### **POST /user**
**Description**: Creates a new user and wallet to simulate custodial wallet to hold the tokenized ERC20 Loyalty Tokens.

---

#### **Request**
- **Method**: `POST`
- **Endpoint**: `/user`
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
    "username": "rami"
}
```

### **GET /user/:username**

**Description**: Get user details

---

#### **Request**
- **Method**: `GET`
- **Endpoint**: `/user/:username`
- **Content-Type**: `application/json`

#### **Response Body**
```json
{
    "user": {
        "_id": "67868724eea55da30610db26",
        "username": "test",
        "wallet_address": "0xA0236420CA08bc92AB578392d036e183F76049B1",
        "private_key": "0xe...e30",
        "tier": "bronze",
        "__v": 0
    }
}
```

### **POST /order**
**Description**: Simulate purchasing an item and in return rewards the user with loyalty tokens calculated based on tier and order amount.

---

#### **Request**
- **Method**: `POST`
- **Endpoint**: `/order`
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
    "username": "test",
    "orderAmount": 200
}
```
#### **Response Body**
```json
{
    "message": "Order placed successfully. You were awarded 400 Loyalty Tokens",
    "transactionHash": "0xba510abac028761b1a87e14d6338e0e27dcd0d02c2798ee39a3a4591d5b6a7ca"
}
```

### **GET /token/balance**

**Description**: Get user balance in loyalty tokens

---

#### **Request**
- **Method**: `GET`
- **Endpoint**: `/token/balance`
- **Content-Type**: `application/json`

#### **Response Body**
```json
{
    "balance": "400"
}
```

### **POST /token/loyalty/withdraw**
**Description**: Converts loyalty tokens to USDT or ETH and withdraws them to wallet address of your choice. Requires an external wallet for full flow see here

---

#### **Request**
- **Method**: `POST`
- **Endpoint**: `/token/loyalty/withdraw`
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
    "username": "test",
    "amount": 100,
    "withdrawTo": "0x59ea825d9DaFcD41dF8297E3ef3Ba792E70437C2",
    "currency": "USDT" //ETH, USDT
}
```
#### **Response Body**
```json
{
    "txHash": "0xe4e142005eb223bebd52c12aa32c6ccb145afaf7fff83a5e59218c4624d05fca"
}
```

### **POST /token/fiat/withdraw**
**Description**: Simulates converting fiat earnings to USDT and withdrawing them to external crypto wallet.

---

#### **Request**
- **Method**: `POST`
- **Endpoint**: `/token/fiat/withdraw`
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
    "username": "test",
    "fiatAmount": 10,
    "currency": "USD",
    "withdrawTo": "0x59ea825d9DaFcD41dF8297E3ef3Ba792E70437C2",
    "crypto": "USDT"
}
```
#### **Response Body**
```json
{
    "message": "Successfully withdrew 10 USD to 10.003611303680628 USDT",
    "tx": "0x1bd857b1dd916e9d6aa612139d2beaba045a71dcca75beefb9c57e4f66b8d31e"
}
```

