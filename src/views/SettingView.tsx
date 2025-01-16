'use client';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { formatAddress, formatEmail } from '@/lib/helper.lib';
import { networkList } from '@/utils/networks.utils';
import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
//import { Network } from "@/interfaces/models.interface";
import { ChevronLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const ConnectedApps = ({
  setView,
  setOld,
}: {
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  setOld: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex flex-col w-[100%] h-screen text-white/75">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          onClick={() => {
            setOld(true);
            setView(false);
          }}
          className="flex items-center"
        >
          <ChevronLeft className="w-6 h-6 mr-4" />
          <h1 className="text-xl font-medium">Connected Apps</h1>
        </div>
      </div>

      {/* Connected Apps List */}
      <div className="px-4 mt-4">
        <h2 className="text-gray-400 text-sm mb-3">Today</h2>

        {/* App Item */}
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
          <div className="flex items-center">
            {/* App Icon */}
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3">
              <div className="w-5 h-5 bg-white rounded-full" />
            </div>
            <span className="text-white">drip.haus</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
        </div>
      </div>
    </div>
  );
};

const PrivateKey = ({
  phrase,
  setView,
  setOld,
}: {
  phrase: string;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  setOld: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Sample private key - in practice this would be passed as a prop

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(phrase);
    toast.success('copied!');
  };

  return (
    <div className="mt-[20px] max-h-screen p-4 rounded-lg max-w-md mx-auto">
      {/* Warning Message */}
      <div className="bg-red-950/30 rounded-lg p-4 mb-6">
        <h2 className="text-red-500/40 font-bold text-center text-lg mb-2">
          Do <span className="underline">not</span> share your{' '}
          <span className="text-white/75">Private Key!</span>
        </h2>
        <p className="text-red-500/40 text-center">
          If someone has your private key they will have full control of your
          wallet.
        </p>
      </div>

      {/* Private Key Display */}
      <div className="bg-gray-900 rounded-2xl mt-[40px] py-7 px-5 mb-12">
        <p className="text-white/70 break-all font-mono text-lg">{`${phrase}`}</p>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopyToClipboard}
        className="w-[50%] bg-gray-900 text-white p-3 mt-[70px] rounded-2xl ml-auto mr-auto mb-12 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
            strokeWidth="2"
          />
          <path
            d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            strokeWidth="2"
          />
        </svg>
        Copy
      </button>

      {/* Done Button */}

      <div className="mt-[10px]">
        <div
          onClick={() => {
            setView(false);
            setOld(true);
          }}
          className="w-[95%] mb-5   ml-auto mr-auto py-1 mt-3 px-3 flex  items-center justify-center bg-white/80 rounded-2xl h-12"
        >
          <p className="text-black font-light text-[20px] ml-auto mr-auto ">
            Close
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

const RecoveryPhrase = ({
  phrase,
  setView,
  setOld,
}: {
  phrase: string;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  setOld: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Sample phrase as a single string
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(phrase);
    toast.success('Copied!');
  };
  // Split the phrase into an array of words
  const words = phrase.split(' ');

  return (
    <div className="mt-0 p-4 max-h-screen rounded-lg max-w-md mx-auto">
      {/* Warning Message */}
      <div className="bg-red-950/25 rounded-lg p-4 mb-4">
        <h2 className="text-red-500/40 font-bold text-center text-lg mb-2">
          Do <span className="underline">not</span> share your{' '}
          <span className="text-white/75">Secret Phrases!</span>
        </h2>
        <p className="text-red-500/40 text-center">
          If someone has your secret phrase they will have full control of your
          wallet.
        </p>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {words.map((word, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-gray-900 rounded-full p-3"
          >
            <span className="text-gray-500 mr-3">{index + 1}</span>
            <span className="text-white">{word}</span>
          </div>
        ))}
      </div>

      {/* Copy Button */}
      <button
        onClick={() => handleCopyToClipboard()}
        className="w-[40%] ml-auto mr-auto bg-gray-900 text-white p-3 rounded-2xl mb-4 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
            strokeWidth="2"
          />
          <path
            d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            strokeWidth="2"
          />
        </svg>
        Copy
      </button>

      {/* Done Button */}

      <div className="mt-14">
        <div
          onClick={() => {
            setView(false);
            setOld(true);
          }}
          className="w-[95%] mb-5   ml-auto mr-auto py-1 mt-3 px-3 flex  items-center justify-center bg-white/80 rounded-2xl h-12"
        >
          <p className="text-black font-light text-[20px] ml-auto mr-auto ">
            Close
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export const SettingView = () => {
  const [account, setAccount] = useState<boolean>(false);
  const [community, setCommunity] = useState<boolean>(false);
  const [networks, setNetworks] = useState<boolean>(false);
  const [options, setOptions] = useState<boolean>(false);
  const [connect, setConnect] = useState<boolean>(false);
  const [about, setAbout] = useState<boolean>(false);
  const [setting, setSetting] = useState<boolean>(true);
  const [phraseView, setPhraseView] = useState<boolean>(false);
  const [privateView, setPrivateView] = useState<boolean>(false);
  const { setActiveChain, network } = useNetwork();
  const { user } = useAuth();

  const handleSwitchTestnet = () => {
    try {
      if (!network.isTestNet) {
        const testnet = networkList
          .filter((network) => network.isTestNet === true)
          .find((item) => item.name === network.name);
        setActiveChain(testnet || network);
        toast.success('Switched to Devnet');
      } else {
        const mainnet = networkList
          .filter((network) => network.isTestNet === false)
          .find((item) => item.name === network.name);
        setActiveChain(mainnet || network);
        toast.success('Switched to Mainnet');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {privateView && (
        <PrivateKey
          phrase={user?.solPrivateKey || ''}
          setOld={setAccount}
          setView={setPrivateView}
        />
      )}
      {phraseView && (
        <RecoveryPhrase
          setView={setPhraseView}
          setOld={setAccount}
          phrase={user?.mnemonic || ''}
        />
      )}
      {about && (
        <>
          <div className="bg-gothic-950/0 mt-0 flex bg-slate-600/0 py-1 text-white/70 mb-2 flex-col  w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <div
                onClick={() => {
                  //setAccount(false);
                  setAbout(false);
                  setSetting(true);
                }}
                className="flex items-center"
              >
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">About</h1>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">About infuse</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {connect && <ConnectedApps setOld={setSetting} setView={setConnect} />}
      {networks && (
        <>
          <div className="bg-gothic-950/0 mt-0 flex bg-slate-600/0 py-1 text-white/75 mb-1 flex-col  w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <div
                onClick={() => {
                  setNetworks(false);
                  setSetting(true);
                }}
                className="flex items-center"
              >
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">Active Networks</h1>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              {networkList &&
                networkList
                  .filter((network) => network.isTestNet === true)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="w-[99%] h-[60px] mt-1 mb-1 rounded-xl bg-slate-500/15 ml-auto mr-auto"
                    >
                      <div className="w-[100%] py-2.5 px-5 flex">
                        <div className="flex">
                          <div className="bg-white/10 animate-pulse flex items-center justify-center  w-10 h-10 rounded-2xl">
                            <img src={item?.native?.logoUrl} />
                          </div>
                          <p className="text-[18px] mt-2 ml-2 mr-2 ">
                            {item.name}
                          </p>
                        </div>
                        <div
                          className="flex ml-auto mr-0.5 items-center bg-gray-200/10 rounded-full p-1 w-20 cursor-pointer"
                          onClick={() => setActiveChain(item)}
                        >
                          <div
                            className={`flex items-center justify-center w-full relative h-8 ${
                              network.name === item.name
                                ? ''
                                : 'flex-row-reverse'
                            }`}
                          >
                            {/* Background slider */}
                            <div
                              className={`absolute w-1/2 h-full bg-white/30 rounded-full shadow-md transition-transform duration-200 ease-in-out
            ${network.name === item.name ? 'left-0' : 'left-1/2'}`}
                            />

                            {/* Icons */}
                            <div className="relative flex w-full">
                              <div
                                className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.name === item.name ? 'text-green-500' : 'text-gray-400'}`}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div
                                className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.name === item.name ? 'text-gray-500' : 'text-gray-400'}`}
                              >
                                <Circle className="w-5 text-red-600/15 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
      {community && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-1 text-white/70 mb-1 flex-col w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-1">
              <div
                onClick={() => {
                  setCommunity(false);
                  setSetting(true);
                }}
                className="flex items-center"
              >
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">Community</h1>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 ml-auto mr-auto px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">X account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {options && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-1 text-white/70 mb-1 flex-col w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-1">
              <div
                onClick={() => {
                  setOptions(false);
                  setSetting(true);
                }}
                className="flex items-center"
              >
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">Developers option</h1>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-1 ml-auto mr-auto px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[66px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  //onClick={() => setAccount(true)}
                  className="w-[100%] py-2 px-4 flex"
                >
                  <p className="text-[18px] flex items-center justify-center ">
                    Devnet Mode
                  </p>
                  {/** switcher */}
                  <div
                    className="flex ml-auto mr-0.5 justify-center items-center bg-gray-200/10 rounded-full p-2 w-20 cursor-pointer"
                    onClick={() => handleSwitchTestnet()}
                  >
                    <div
                      className={`flex items-center justify-center w-full relative h-8 ${
                        network.isTestNet ? '' : 'flex-row-reverse'
                      }`}
                    >
                      {/* Background slider */}
                      <div
                        className={`absolute w-1/2 h-full bg-white/30 rounded-full shadow-md transition-transform duration-200 ease-in-out
            ${network.isTestNet ? 'left-0' : 'left-1/2'}`}
                      />

                      {/* Icons */}
                      <div className="relative flex w-full">
                        <div
                          className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.isTestNet ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div
                          className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.isTestNet ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          <Circle className="w-5 text-red-600/15 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Toaster />
          </div>
        </>
      )}
      {setting && (
        <>
          <div className="bg-gothic-950/0 mt-0 max-h-screen flex bg-slate-600/0 py-1 text-white/70 mb-2 flex-col w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <Link href="/wallet" className="flex items-center">
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">Settings</h1>
              </Link>
            </div>

            <div className="w-[98%] ml-auto mr-auto mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setAccount(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setNetworks(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div
                  onClick={() => {
                    setSetting(false);
                    setConnect(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setOptions(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setCommunity(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div
                  onClick={() => {
                    setSetting(false);
                    setAbout(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {account && (
        <>
          <div className="bg-gothic-950/0 mt-0 flex bg-slate-600/0 py-1 text-white/70 mb-2 flex-col w-[100%] h-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <div
                onClick={() => {
                  setAccount(false);
                  setSetting(true);
                }}
                className="flex items-center"
              >
                <ChevronLeft className="w-6 h-6 mr-4" />
                <h1 className="text-xl font-medium">Account</h1>
              </div>
              <MoreVertical className="w-6 h-6" />
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 ml-auto mr-auto h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <p className="flex text-white/30 text-[17px] ml-auto mr-2 items-center justify-center">
                    {user?.username?.toLowerCase() || ''}
                  </p>
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4  px-5 flex">
                  <p className="text-[18px] ">Email</p>
                  <p className="flex text-white/30 text-[17px] ml-auto mr-2 items-center justify-center">
                    {formatEmail(user?.email?.toLowerCase() || '') || ''}
                  </p>
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Address</p>
                  <p className="flex text-white/30 text-[17px] ml-auto mr-2 items-center justify-center">
                    {formatAddress(user?.solPublicKey || '') || ''}
                  </p>
                </div>
              </div>

              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setAccount(false);
                    setPhraseView(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Show Recovery Phrases</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div
                  onClick={() => {
                    setAccount(false);
                    setPrivateView(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Show Private Keys</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] font-semibold text-red-600/75 ">
                    Delete Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
