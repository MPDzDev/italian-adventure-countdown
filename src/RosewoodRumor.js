import React, { useState, useEffect, useMemo } from 'react';
import './RosewoodRumor.css';

const RosewoodRumor = () => {
  const facts = useMemo(
    () => [
      "A certain clique in Rosewood can't seem to escape trouble.",
      'Anonymous messages hold more weight than gossip in this small town.',
      "The bell tower has witnessed more drama than most places in Rosewood.",
      'Masked gatherings rarely end calmly here.',
      'Secrets buried in Rosewood never stay hidden for long.',
      'Mysterious texts keep everyone guessing.',
      "Friendships are tested daily in Rosewood's halls.",
      'Every clue brings an A-plus puzzle with it.'
    ],
    []
  );

  const [rumor, setRumor] = useState('');

  useEffect(() => {
    setRumor(facts[Math.floor(Math.random() * facts.length)]);
  }, [facts]);

  return (
    <div className="rosewood-rumor">
      <h3 className="rosewood-rumor-title">Rosewood Rumor</h3>
      <p className="rosewood-rumor-text">{rumor}</p>
    </div>
  );
};

export default RosewoodRumor;
