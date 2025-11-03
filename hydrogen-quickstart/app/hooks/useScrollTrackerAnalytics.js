import {useEffect, useCallback} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

const useScrollTrackerAnalytics = () => {
  const {publish} = useAnalytics();

  // scroll event fire at 90%
  const trackScroll = useCallback(() => {
    console.log('trackScroll');
    publish('custom_track_scroll', {});
  }, [publish]);

  useEffect(() => {
    window.addEventListener('scroll', trackScroll);
    return () => window.removeEventListener('scroll', trackScroll);
  }, [trackScroll]);
};

export {useScrollTrackerAnalytics};
