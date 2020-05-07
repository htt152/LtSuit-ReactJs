import {combineReducers} from 'redux';
import fuse from './fuse';
import auth from 'app/auth/store/reducers';
import quickPanel from 'app/fuse-layouts/shared-components/quickPanel/store/reducers';
import nghiPhepReducer from '../reducers/fuse/nghiPhep.reducer'

const createReducer = (asyncReducers) =>
    combineReducers({
        nghiPhepReducer,
        auth,
        fuse,
        quickPanel,
        ...asyncReducers
    });

export default createReducer;
