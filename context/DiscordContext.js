import { createContext } from 'react'
import { useContext, useState } from 'react';
import { useEffect } from 'react';

export const DiscordContext = createContext({});

export const useDiscord = () => useContext(DiscordContext);

export default function DiscordProvider({ children }) {
  const [discordUsername, setDiscordUsername] = useState('');
  const [discordId, setDiscordId] = useState();

  function checkUpdates() {
    let discordInfo = localStorage.getItem('discordInfo')
    if (discordInfo != "undefined") {
      discordInfo = JSON.parse(discordInfo);
    }
    console.log(discordInfo)
    setDiscordUsername(discordInfo?.username);
    setDiscordId(discordInfo?.id);
  }

  function logout() {
    localStorage.removeItem('discordInfo');
    localStorage.removeItem('oauthData');
    checkUpdates();
  }

  useEffect(() => {
    checkUpdates();
    console.log("Hello")
  }, [])

  const value = {
    discordUsername,
    discordId,
    checkUpdates,
    logout
  }

  return <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>
}