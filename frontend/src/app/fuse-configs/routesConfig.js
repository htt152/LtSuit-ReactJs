import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse';
import { ExampleConfig } from 'app/main/example/ExampleConfig';
import { LoginConfig } from 'app/main/login/LoginConfig'
import { ForgotPwConfig } from 'app/main/forgot-password/ForgotPwConfig'
import { ChangePwConfig } from 'app/main/change-password/ChangePwConfig'
import { MessageConfig } from 'app/main/message/MessageConfig'
import { ListNghiPhepConfig } from 'app/main/listNghiPhep/listNghiPhepConfig'
import { FormNpConfig } from 'app/main/nghiphep/FormNpConfig'
import { XacNhanNghiConfig } from 'app/main/xacNhanNghi/xacNhanNghiConfig'
import { pagesConfigs } from '../../pages/PageConfig'
import { LearningConfig } from 'app/main/learning/learningConfig'
import { MyLearningPointsConfig } from 'app/main/my-learning-points/myLearningPointsConfig'
import { DangKyPointConfig } from 'app/main/dangKyPoint/dangKyPointConfig'
import {ConfirmPointsConfig} from 'app/main/admin-xacnhan-diem/confirmPointsConfig'
import { ProfileConfig } from 'app/main/profile/profileConfig'
import {ThanhVienConfig} from 'app/main/thanhVien/thanhVienConfig'
import {ListTeamConfig} from 'app/main/listTeam/listTeamConfig'

const routeConfigs = [
    ...pagesConfigs,
    XacNhanNghiConfig,
    ExampleConfig,
    LoginConfig,
    ListNghiPhepConfig,
    ForgotPwConfig,
    ChangePwConfig,
    MessageConfig,
    FormNpConfig,
    LearningConfig,
    MyLearningPointsConfig,
    ConfirmPointsConfig,
    DangKyPointConfig,
    ProfileConfig,
    ThanhVienConfig,
    ListTeamConfig
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/login" />
    },
    {
        component: () => <Redirect to="/404NotFound" />
    }
];

export default routes;
