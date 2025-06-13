import React, { useState, useEffect, useMemo } from 'react';
import './RosewoodRumor.css';

const RosewoodRumor = () => {
  const facts = useMemo(
    () => [
      "A certain clique in Lido Adriano can't seem to escape trouble.",
      'Anonymous messages hold more weight than gossip in this small town.',
      "The bell tower has witnessed more drama than most places in Lido Adriano.",
      'Masked gatherings rarely end calmly here.',
      'Secrets buried in Lido Adriano never stay hidden for long.',
      'Mysterious texts keep everyone guessing.',
      "Friendships are tested daily in Lido Adriano's halls.",
      'Every clue brings an A-plus puzzle with it.'
      "Friendships are tested daily in Rosewood's halls.",
      'Every clue brings an A-plus puzzle with it.',
      "Someone's bold new hair color is stirring the rumor mill."
    ],
    []
  );

  const [rumor, setRumor] = useState('');

  useEffect(() => {
    setRumor(facts[Math.floor(Math.random() * facts.length)]);
  }, [facts]);

  return (
    <div className="rosewood-rumor">
      <p className="rosewood-rumor-text">{rumor}</p>
    </div>
  );
};

export default RosewoodRumor;
