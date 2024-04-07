import { checkIfPropExistsInObject } from '@/utils/lib';
import { merge } from 'lodash';

type TActionTypes = 'TOGGLE_ADD' | 'TOGGLE_SELECT_ALL' | 'CHANGE' | 'SAVE';

type TActionPayload = {
  type: TActionTypes;
  payload: any;
};

type TExtendedObjType = {
  sync_mode: string;
  cursor_field?: string[];
  destination_sync_mode: string;
};

type TIncomingObjType = 'stream' | 'sink';

const hasSourceDefinedCursor = (obj: any) => {
  return !!(checkIfPropExistsInObject(obj, 'source_defined_cursor') && !!obj.source_defined_cursor);
};

const generateObj = (obj: any, type: TIncomingObjType) => {
  let extendedObj: TExtendedObjType = {
    sync_mode: obj.supported_sync_modes ? obj.supported_sync_modes[obj.supported_sync_modes.length > 1 ? 1 : 0] : '',
    destination_sync_mode: 'append'
  };
  if (hasSourceDefinedCursor(obj)) {
    extendedObj['cursor_field'] = obj.default_cursor_field ? obj.default_cursor_field[0] : [''];
  }

  let newobj = {
    [type]: obj
  };

  const merged = merge({}, newobj, extendedObj);

  return merged;
};

const updateObj = (obj: any, key: string, value: string) => {
  let newObj = { ...obj };
  newObj[key] = value;
  return newObj;
};

export default function streamsReducer(state: any, action: TActionPayload) {
  switch (action.type) {
    case 'TOGGLE_ADD': {
      let ids: string[] = state.ids;
      const entities: any = state.entities;

      const { id, obj } = action.payload;
      const selectedIndex = ids.indexOf(id);

      if (selectedIndex === -1) {
        ids = [...ids, id];
        entities[id] = generateObj(obj, 'stream');
      } else {
        ids = ids.filter((i) => i !== id);

        delete entities[id];
      }

      return {
        ...state,
        ids: ids,
        entities: {
          ...state.entities,
          ...entities
        }
      };
    }

    case 'TOGGLE_SELECT_ALL': {
      const objs = action.payload.objs;
      const checked = action.payload.checked;

      const ids: string[] = [];
      const entities: any = {};

      if (checked) {
        objs.forEach((obj: any) => {
          ids.push(obj.name);
          entities[obj.name] = generateObj(obj, 'stream');
        });
      }

      return {
        ...state,
        ids: ids,
        entities: entities
      };
    }
    case 'CHANGE': {
      const id = action.payload.id;
      const value = action.payload.value;
      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: updateObj(state.entities[id], 'sync_mode', value)
        }
      };
    }
    case 'SAVE': {
      const objs = action.payload.objs;

      const ids: string[] = [];
      const entities: any = {};

      objs.forEach((obj: any, i: number) => {
        ids.push(obj?.stream?.name ?? i);
        entities[obj?.stream?.name ?? i] = obj;
      });

      return {
        ...state,
        ids: ids,
        entities: entities
      };
    }

    default:
      return state;
  }
}
