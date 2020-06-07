import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';

// eslint-disable-next-line import/no-mutable-exports
let Authorized = RenderAuthorize(getAuthority());

const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
