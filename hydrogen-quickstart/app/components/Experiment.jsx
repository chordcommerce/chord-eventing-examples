import {useState, useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

export const Experiment = ({variantA, variantB, children}) => {
  const [currentVariant, setCurrentVariant] = useState(null);
  const {publish} = useAnalytics();

  useEffect(() => {
    const variant = Math.random() < 0.5 ? variantA : variantB;
    setCurrentVariant(variant);
  }, [variantA, variantB]);

  useEffect(() => {
    publish('custom_experiment_viewed', {
      customData: {
        experimentId: currentVariant?.customData?.experimentId,
        variant: currentVariant?.customData?.variant,
      },
    });
  }, [currentVariant, publish]);

  if (!currentVariant) {
    return null;
  }

  return currentVariant.content || children;
};

// Example usage:
/*
<Experiment 
  variantA={<button className="bg-blue-500">Click me</button>}
  variantB={<button className="bg-green-500">Click me</button>}
/>
*/
