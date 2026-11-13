import { useState } from 'react';
import { Mascot, useMascotMood } from './components/mascot';

const QUESTION = {
  text: 'বাংলাদেশের রাজধানী কোনটি?',
  choices: ['চট্টগ্রাম', 'ঢাকা', 'সিলেট', 'খুলনা'],
  answer: 1,
};

export default function App() {
  const { mood, react } = useMascotMood(2200);
  const [result, setResult] = useState<'ok' | 'no' | null>(null);

  function pick(index: number) {
    const correct = index === QUESTION.answer;
    setResult(correct ? 'ok' : 'no');
    react(correct ? 'happy' : 'sad');
  }

  return (
    <main className="app">
      <div className="stage">
        <Mascot mood={mood} size={240} />
      </div>

      <section className="card">
        <h2>{QUESTION.text}</h2>
        <div className="choices">
          {QUESTION.choices.map((c, i) => (
            <button key={c} className="choice" onClick={() => pick(i)}>
              {c}
            </button>
          ))}
        </div>
        <p className={`msg ${result ?? ''}`}>
          {result === 'ok' && 'দারুণ! সঠিক উত্তর 🎉'}
          {result === 'no' && 'ইশ, আবার চেষ্টা করো'}
        </p>
      </section>

      <div className="tools">
        <button onClick={() => react('thinking')}>ভাবছে</button>
        <button onClick={() => react('wave')}>হাই</button>
        <button onClick={() => react('idle')}>শান্ত</button>
      </div>
    </main>
  );
}
