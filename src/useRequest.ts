import { useCallback } from 'react';
import { useUserDataContext } from './UserDataProvider';
import { backendUrl } from './config';
import { EndPoint, EndPointRequest, Resources } from './types';

export const useRequest = () => {
  const { userData } = useUserDataContext();

  const sendRequest = useCallback(
    <
      R extends keyof Resources & string,
      M extends keyof Resources[R]['methods'] & string,
      E extends EndPoint & Resources[R]['methods'][M],
    >(
      resource: R,
      method: M,
      path: Resources[R]['path'],
      {
        params,
        body,
        signal,
        onResponse,
        onResponseBody,
      }: EndPointRequest<E> & {
        signal?: AbortSignal | undefined;
        onResponse?: (response: Response) => void;
        onResponseBody?: (responseBody: E['responseBody']) => void;
      },
    ) => {
      const safeRequestData = {
        method,
        path,
        signal: signal ?? null,
        params: params ?? ({} as NonNullable<E['params']>),
        body: method !== 'GET' ? JSON.stringify(body) ?? null : null,
      };
      const paramsString = Object.entries(safeRequestData.params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const headers = {
        ...(userData && { authentication: `Bearer ${userData?.token}` }),
        'content-type': 'application/json',
      };
      fetch(
        `${backendUrl}${safeRequestData.path}${
          paramsString.length ? `?${paramsString}` : ''
        }`,
        {
          method: safeRequestData.method,
          headers,
          body: safeRequestData.body,
          signal: safeRequestData.signal,
        },
      )
        .then((response) => {
          onResponse?.(response);
          if (onResponseBody && response.ok) {
            response
              .text()
              .then((responseBodyText) => {
                try {
                  onResponseBody(
                    JSON.parse(responseBodyText) as E['responseBody'],
                  );
                } catch {
                  onResponseBody(responseBodyText);
                }
              })
              .catch(() => {
                console.error('error occured during decoding', method, path);
              });
          }
        })
        .catch(() => {
          console.error('error occured during request', method, path);
        });
    },
    [userData],
  );

  return { sendRequest };
};
