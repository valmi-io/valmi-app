import CatalogCard from '@/content/Catalog/CatalogCard';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import { getOAuthObjInStore, getSelectedConnectorKey, getSelectedConnectorObj } from '@/utils/connectionFlowUtils';
import { redirectToCreateDataFlow, redirectToCredentials } from '@/utils/router-utils';
import { TCatalog } from '@/utils/typings.d';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export type ConnectorType = {
  display_name: string;
  docker_image: string;
  docker_tag: string;
  oauth?: boolean;
  type: string;
  connector_type?: string; // returned from backend
  oauth_keys?: 'private' | 'public';
  mode?: string[];
};

export type NewConnectorType = {
  display_name: string;
  oauth?: boolean;
  type: string;
  oauth_keys?: 'private' | 'public';
  oauth_params?: object; // added in ConnectorsPageContent
  oauth_error?: string;
};

const CatalogList = ({ catalogs }: { catalogs: TCatalog[] }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  /**
   * Checks if the catalog has any connections.
   */
  const hasConnections = (catalog: TCatalog): boolean => !!catalog?.connections;

  const handleCatalogOnClick = (catalog: TCatalog) => {
    const type = catalog?.display_name.toLowerCase();

    const key = getSelectedConnectorKey();
    const objToDispatch = {
      ids: [key],
      entities: {
        [key]: { ...getSelectedConnectorObj(catalog, key), ...getOAuthObjInStore(catalog) } // initially setting oauth_params, oauth_error to empty in store
      }
    };

    dispatch(setConnectionFlowState(objToDispatch));

    if (hasConnections(catalog)) {
      redirectToCredentials({ router, wid: workspaceId, type: type });
    } else {
      redirectToCreateDataFlow({ router, wid: workspaceId });
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {catalogs.map((catalog: TCatalog) => {
        return <CatalogCard key={catalog.type} catalog={catalog} handleCatalogOnClick={handleCatalogOnClick} />;
      })}
    </Grid>
  );
};

export default CatalogList;
