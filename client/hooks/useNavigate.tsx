import { useRouter } from 'next/router';

// TODO: Figure out routes..
export const Routes = {
  Partners: {
    'Packages': '/Partners/Packages',
    'Organizations': 'Organizations',
    'Partners': 'Partners'
  }
};

export function useNavigate(path: string, refetch?: boolean) {
  const router = useRouter();

  return [(_path?: string, _refetch?: boolean) => {
    if (_path) {
      path = _path;
    }
    if (_refetch !== undefined && _refetch !== null) {
      refetch = _refetch;
    }

    if (refetch) {
      return router.push(`${path}?refetch=true`, path);
    }

    return router.push(path);
  }];
}
