# RPC Event Service

RPC Event Service is a Node.js application that listens for and processes events from an EVM (Ethereum Virtual Machine) blockchain. This service utilizes RPC (Remote Procedure Call) to capture and respond to events triggered by smart contracts. It is built with **Node.js** and **Express.js**, and is designed for real-time event handling and scalability.

## Features

- **Blockchain Event Capture**: Listens to smart contract events on an EVM-compatible blockchain (Ethereum, Binance Smart Chain, Polygon, etc.).
- **Real-Time Processing**: Processes events in real time with minimal latency to enable quick reactions to blockchain activity.
- **Integration**: Seamlessly integrates with other backend services for processing blockchain data (e.g., updating databases, triggering notifications, etc.).
- **Event Logs**: Captures and stores all blockchain events with detailed information for analysis and troubleshooting.
- **Scalability**: Built using a microservice architecture, allowing the service to scale horizontally as needed.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Lightweight web framework for building RESTful APIs and handling HTTP requests.
- **MongoDB (Optional)**: For storing event logs, if required.

## Installation

Follow these steps to set up and run the RPC Event Service on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/rpc-event-service.git
2. **Navigate to the project directory**

```bash
cd rpc-event-service
```
3. **Install dependencies**
```bash
npm install
```
4. **Set up environment variables**
NODE_ENV = DEV
PORT = 4000

5. **Start the server**
```bash
npm run dev
```




