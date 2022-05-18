import { createContext } from 'react'
import { useContext, useState } from 'react';

export const DiscordContext = createContext({});

export const useDiscord = () => useContext(DiscordContext);

export default function DiscordProvider({ children }) {
  const [discordUsername, setDiscordUsername] = useState('');
  
  function checkUpdates() {
    const discordInfo = JSON.parse(localStorage.getItem('discordInfo'));
    setDiscordUsername(discordInfo?.username);
  }

  function logout() {
    localStorage.removeItem('discordInfo');
    localStorage.removeItem('oauthData');
    checkUpdates();
  }

  const value = {
    discordUsername,
    checkUpdates,
    logout
  }

  return <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>
}