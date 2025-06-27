import {useEffect} from 'react';
import {useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {getCookie, combineCartAttributes} from '../lib/utils';

export const useChordIdentifiers = (cart) => {
  const fetcher = useFetcher();

  useEffect(() => {
    try {
      if (!cart?.id) return;
      const attributes = [];
      const googleClientId = getCookie('_ga')?.substring(6);
      const chordCdpAnonymousId = getCookie('__eventn_id');

      if (chordCdpAnonymousId) {
        attributes.push({
          key: '_cdpAnonymousId',
          value: chordCdpAnonymousId,
        });
      }

      if (googleClientId) {
        attributes.push({
          key: '_googleClientId',
          value: googleClientId,
        });
      }

      // Check if any attributes need to be updated
      const requiresUpdate = attributes.some(({key, value}) => {
        const cartAttribute = cart?.attributes?.find(
          (attr) => attr.key === key,
        );
        return !cartAttribute || cartAttribute.value !== value;
      });

      if (!requiresUpdate) return;

      // Combine new cart attributes with existing cart attributes
      const combinedAttributes = combineCartAttributes(
        cart?.attributes || [],
        attributes,
      );

      const formInput = {
        action: CartForm.ACTIONS.AttributesUpdateInput,
        inputs: {
          attributes: combinedAttributes,
        },
      };

      fetcher.submit(
        {[CartForm.INPUT_NAME]: JSON.stringify(formInput)},
        {method: 'POST', action: '/cart'},
      );
    } catch (e) {
      console.error('Error saving Chord identifiers', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.id]);
};
