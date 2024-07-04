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

export const hasSourceDefinedCursor = (obj: any) => {
  return !!(checkIfPropExistsInObject(obj, 'source_defined_cursor') && !!obj.source_defined_cursor);
};

/**
 * Generates a configured catalog object based on the provided object and type.
 * @param obj The object containing configuration data.
 * @param type The type of the incoming object.
 * @returns A merged object containing the original object under the specified type and extended properties.
 */
export const generateStreamObj = (obj: any, type: TIncomingObjType) => {
  // Determine sync_mode based on supported_sync_modes array
  let extendedObj: TExtendedObjType = {
    sync_mode: obj.supported_sync_modes ? obj.supported_sync_modes[obj.supported_sync_modes.length > 1 ? 1 : 0] : '',
    destination_sync_mode: 'append'
  };

  // Add cursor_field if source has defined cursor
  if (hasSourceDefinedCursor(obj)) {
    extendedObj['cursor_field'] = obj.default_cursor_field ? [obj.default_cursor_field[0]] : [''];
  }

  // Create a new object with obj under specified type
  let newobj = {
    [type]: obj
  };

  // Merge newobj and extendedObj into a single object
  const merged = merge({}, newobj, extendedObj);

  return merged;
};

/**
 * Generates an array of configured stream objects from an array of input stream objects.
 * @param streams An array of objects representing different configurations or definitions of streams.
 * @returns An array of configured stream objects, each processed by generateStreamObj.
 */
export const generateConfiguredStreams = (streams: any[]) => {
  const configuredStreams = [];

  // Process each stream object and generate a configured stream object
  for (let i = 0; i < streams.length; i++) {
    configuredStreams.push(generateStreamObj(streams[i], 'stream'));
  }
  return configuredStreams;
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
        entities[id] = generateStreamObj(obj, 'stream');
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
          entities[obj.name] = generateStreamObj(obj, 'stream');
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
