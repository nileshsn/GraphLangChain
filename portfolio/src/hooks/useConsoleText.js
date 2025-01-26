import { useState, useEffect, useCallback } from 'react';

export function useConsoleText(words, delay = 120) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(delay);

  const tick = useCallback(() => {
    let i = loopNum % words.length;
    let fullText = words[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setTypingSpeed(prevSpeed => prevSpeed / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setTypingSpeed(delay);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(delay);
    }
  }, [words, loopNum, isDeleting, text, delay]);

  useEffect(() => {
    let timer = setTimeout(() => {
      tick();
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, tick, typingSpeed]);

  return text;
}
