import React, { useState, useEffect, useCallback } from "react";
import './App.css';
import idl1 from './counter.json';
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Provider, web3, utils } from '@project-serum/anchor';
import idl2 from './whitelist.json';
import Papa from 'papaparse';
import kp from './keypair.json';


async function airdrop(connection, destinationWallet, amount) {
  const airdropSignature = await connection.requestAirdrop(destinationWallet.publicKey, 
    amount * anchor.web3.LAMPORTS_PER_SOL);
  const latestBlockHash = await connection.getLatestBlockhash();
  const tx = await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature
  });
}




const App = () => {
  const [recipients, setRecipients] = useState([]);
  const [theCounterPDA, setTheCounterPDA] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  // let  whitelist = anchor.web3.Keypair.generate();
  const [sameProgram, setSameProgram] = useState(null);
  const [sameProgram2, setSameProgram2] = useState(null);
  const [sameWhitelist, setSameWhitelist] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const network = clusterApiUrl('devnet');
  const arr = Object.values(kp._keypair.secretKey);
  const secret = new Uint8Array(arr);
  const whitelist = web3.Keypair.fromSecretKey(secret)
  // const network = "http://127.0.0.1:8899";
  
  const opts = {
    preflightCommitment: "processed"
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response);

        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }
  const changeHandler =  async (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: false,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        const addresses = [];
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          addresses.push(Object.values(d)[0]);
        });
      setTableRows(rowsArray[0]);
      setValues(valuesArray);
      setRecipients(addresses);
      },
    });

  };
  const CounterProgram = new PublicKey(idl1.metadata.address);
  const WhitelistProgram = new PublicKey(idl2.metadata.address);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response);
    }
  };
  const InitializeCounter = async() =>{
    
  const provider = getProvider();

  const program = new Program(idl1, CounterProgram, provider);
  const program2 = new Program(idl2, WhitelistProgram, provider);
    // await airdrop(provider.connection, walletAddress,2);
    // setSameProgram(program);
    // setSameProgram2(program2);
    // await new Promise(f => setTimeout(f, 1000));
    await airdrop(provider.connection, whitelist,1);
    let initial = await program.provider.connection.getBalance(whitelist.publicKey);
    console.log(initial);
    console.log(whitelist.publicKey.toString());
    // let initial = await program.provider.connection.getBalance(whitelist.publicKey);
    // console.log(initial);
    // setSameWhitelist(whitelist);
    let [counterPDA, counterBump]= await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("counter")), walletAddress.publicKey.toBuffer()],
      program.programId
      );
      
    console.log(counterBump);
    
      try{
            await program.methods
            .initCounter(counterBump)
            .accounts({
              authority: walletAddress.publicKey,
              counter: counterPDA,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([])
            .rpc();
            let counter = await program.account.counter.fetch(counterPDA);
            console.log("Your counter PublicKey: ",counterPDA.toString());
            console.log("Your counter number is: ",counter.count.toNumber());
           
            
      }catch(e){
            console.log(e);
      }try{
            
            await program.methods
                .pointToWhitelist()
                .accounts({
                  authority:walletAddress.publicKey,
                  counter: counterPDA,
                  whitelisting: whitelist.publicKey,
                  pointerToWhitelistId: program2.programId,
                  systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([whitelist])
                .rpc();
                console.log("HELLO", counterPDA.toString());
                setTheCounterPDA(counterPDA);

      }catch(e){
        console.log(e);
      }
   
  }
  const sendAddress = async () => {
    
    const provider = getProvider();
    const program = new Program(idl1, CounterProgram, provider);
    const program2 = new Program(idl2, WhitelistProgram, provider);
    var recipients_length = recipients.length;
    console.log("The publicKeys Added are:", recipients);
    let [counterPDA,]= await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("counter")), walletAddress.publicKey.toBuffer()],
      program.programId
      );
      let counter = await program.account.counter.fetch(counterPDA);
      console.log("Your counter PublicKey: ",counterPDA.toString());
      console.log("Your counter number is: ",counter.count.toNumber());
      console.log("whitelist is :", whitelist.publicKey.toString());
      console.log(whitelist.publicKey.toString());
      let money = await program.provider.connection.getBalance(whitelist.publicKey);
      console.log("money is:", money);
    // console.log(theCounterPDA.toString());
    
      for (var i = 0; i < recipients_length; i++) {
        try{
          let wallet2 = new PublicKey(recipients[i]);
          let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
            [whitelist.publicKey.toBuffer(), wallet2.toBuffer()],
            program2.programId
          );
        
          console.log(PDA.toString());
          await program.methods
          .manipulateAddress(wallet2, false)
          .accounts({
            authority: walletAddress.publicKey,
            counter: counterPDA,
            pdaId: PDA,
            whitelisting: whitelist.publicKey,
            updateId: program2.programId,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([])
          .rpc();
          console.log("Adding Address", wallet2.toString(),"to the whitelist");
          }
        catch(e){
          console.log(e);
        };
      };
  };
  
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const InitButton = async () => {
    try{
      if (!walletAddress) throw new Error('Wallet not connected!');
      await InitializeCounter();

    }catch(e){
    console.log(e);
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      
      await checkIfWalletIsConnected();
      
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // const RemoveAddress = () => (
  //   <div>
  //           <button
  //             className="cta-button sign-button"
  //             onClick={InitButton}
  //           >
  //          Remove Address
  //         </button>
  //  </div>
  // );

  const InitWhitelist = () => (
    <div>
            <button
              className="cta-button sign-button"
              onClick={InitButton}
            >
           Init Whitelist
          </button>
   </div>
  );
  
  const renderConnectedContainer = () =>{
    return(
      <div className="connected-container">
      <div className = "wrap-image-thumbnail-blog">
      <div>

      <h1 className="h1-gradient font-size-3em"> Welcome to Whitelist Contract Dashboard</h1>
      {InitWhitelist()}
      <div>
          <button className = "cta-button sign-button"  onClick={async () => {
            sendAddress();
          }}>Send to All Adresses</button>
        </div>
      <input
        type="file"
        name="file"
        className="select-file"
        onChange={changeHandler}
        accept=".csv"
        style={{margin: "10px auto"}}
      />
          <br />
          <br />
          <table className= "styled-table">
     
        <thead className = "styled-table thead tr">
          <tr>
          {/* <p className="minus-text"> */}
          {/* <p className="sub-text"> */}
            {tableRows.map((rows, index) => {
              
              return <th className ="minus-text" key={index}>{rows}</th>;
            })}
          {/* </p> */}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return <td className="minus-text" key={i}>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
       
        {/* {RemoveAddress()} */} 
        
        
        {/* <img src="https://assets.website-files.com/611580035ad59b20437eb024/61f9dd0e9bcfb573c8ff9c6e_image-blog-2.jpg" loading="lazy" alt="" class="image-thumbnail-blog">
      </img> */}
      </div>
      {/* <img src ="https://assets.website-files.com/611580035ad59b20437eb024/6170e6b7587b587e289e9d75_line%20svg%20(1).png" loading="lazy" sizes="100vw" alt="" class="star">
      </img> */}
      </div>
      </div>
    );

  }
  
  return (
    <div className="App">      
        {/* <div class="grid-3">
        <div class="wrap-image-thumbnail-blog">
        <img src="https://assets.website-files.com/611580035ad59b20437eb024/61f9dd0e5ebb26817a7ac96b_image-blog.jpg" loading="lazy" alt="" class="image-thumbnail-blog">
        </img>
        </div> */}
      {/* </div> */}
      <div className="div-container relative">
      <div className ="blockwrap-sdk overflow hidden">
        <div className= "content-center">
          <div className = "wraper-padding-bug">
            <div className = "max-width-60ch margin-center">
              <div className = "logo-wrapper-bug-bounty">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Mlh-logo-color.svg/1024px-Mlh-logo-color.svg.png?20200614125343" loading="lazy" alt="" class="immunef-logo drift-logo">
              </img>
              {walletAddress ? !renderConnectedContainer() :<div className = "w-embed">

                <svg width="1em" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9 9" stroke="white"  strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>

              </div>}
              {walletAddress ? !renderConnectedContainer() :<img src="https://solana.com/src/img/branding/solanaLogo.svg" loading="lazy" alt="" className="immunef-logo solana-logo">
              </img>}
              </div>
              {walletAddress ? !renderConnectedContainer() :<h1 className="h1-gradient font-size-3em">Created by MLH Fellows</h1>}
              {walletAddress ? !renderConnectedContainer() : <p>Please connect your wallet to continue</p>}
              {/* <div class ="padding-2">
              </div> */}
              <div className={walletAddress ? 'authed-container' : 'container'}></div>
              <div>{!walletAddress && renderNotConnectedContainer()}</div>
              {walletAddress ? renderConnectedContainer() : null}
            </div>
          </div>
        </div>
        {walletAddress ? !renderConnectedContainer() : <img src ="https://assets.website-files.com/611580035ad59b20437eb024/6170e6b7587b587e289e9d75_line%20svg%20(1).png" loading="lazy" sizes="100vw" alt="" className="star"></img>}
      </div>
    </div>
      
 
      
              
    </div>
  );
}

 

export default App;
