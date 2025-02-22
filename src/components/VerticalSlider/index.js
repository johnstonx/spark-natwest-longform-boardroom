import React, { useState, useEffect, useRef } from 'react';

import Bubble from './subcomponents/Bubble';
import Bubbles from '../Bubbles';

import { verticalSlider } from '../../data';

import './style.scss';


function VerticalSlider() {
  const [data] = useState(verticalSlider);
  const [scrolled, setScrolled] = useState(0);
  const [conDimensions, setContainerDimensions] = useState(0);
  const [fixed, updateFixed] = useState(false);
  const [titleFade, triggerTitleFade] = useState(false);

  const bubbleSlider = useRef(null);
  const bubbleTitle = useRef(null);

  const handleScroll = () => {
    window.requestAnimationFrame(() => {
      const timeLineBB = bubbleSlider.current.getBoundingClientRect();
      const timeLineTitleBB = bubbleTitle.current.getBoundingClientRect();
      if (timeLineBB.top - window.innerHeight < 0 && timeLineBB.bottom > 0) {
        if ((timeLineTitleBB.top < 110 && !fixed) && (timeLineBB.bottom - window.innerHeight > 0)) {
          updateFixed(true);
          triggerTitleFade(false);
        } else if ((timeLineBB.bottom < 0 && fixed) || timeLineBB.top > 110) {
          updateFixed(false);
          triggerTitleFade(false);
        } else if (timeLineBB.bottom < (window.innerHeight / 2)) {
          triggerTitleFade(true);
          setTimeout(() => {
            updateFixed(false);
          }, 300);
        }
      }
    });
  };

  const amountScrolledandHeight = () => {
    // ONly if slider in view should anything change, else return
    if ((bubbleSlider.current.getBoundingClientRect().top - window.innerHeight) > 0 || bubbleSlider.current.getBoundingClientRect().bottom < 0) {
      console.log('out of view');
      return;
    }

    handleScroll();
    // get amount of slider scrolled
    const value = bubbleSlider.current.getBoundingClientRect().top - window.innerHeight;
    setScrolled(-value);

    const ConHeight = bubbleSlider.current.getBoundingClientRect();
    if (ConHeight != null) {
      setContainerDimensions(ConHeight);
    }
  };

  useEffect(() => {
    // on update
    window.addEventListener('scroll', amountScrolledandHeight);
    return function cleanup() {
      window.removeEventListener('scroll', amountScrolledandHeight);
    };
  });

  return (
    <div className="vertical-slider" ref={bubbleSlider}>
      <h2 className={`vertical-slider__title ${fixed ? 'fixed' : ''} ${titleFade ? 'fade' : ''}`} ref={bubbleTitle}>What challenges do businesses face in becoming Future Fit?</h2>
      <div className="vertical-slider__container">
        {data.map((item, i) => {
          return (
            <Bubble right={item.coordRight} top={item.coordTop} title={item.stat} copy={item.copy} scrolled={scrolled} conDimen={conDimensions} key={`bubble-${i + 1}`} />
          );
        })}
        <Bubbles lessBubbles />
      </div>
    </div>
  );
}

export default VerticalSlider;
