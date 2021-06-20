import { Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import {
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  Response,
  RestSerializer,
  Server,
} from 'miragejs';

import { Registry } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { getMany, set, setMany } from 'idb-keyval';
import * as faker from 'faker';

const FAKE_JWT_TOKEN = 'fake-jwt-token';

type Role = {
  id: number;
  title: string;
  users: User[] | any;
};

type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: Role[] | any;
  queues: Queue[] | any;
};

type Userdto = {
  user: User | any;
  token: string;
  valid: boolean;
};

type Profile = {
  id: number;
  user: User | any;
  name: string;
};

type Doctor = {
  id: number;
  specialties: Specialty[] | any;
  user: User | any;
};

type Patient = {
  id: number;
  user: User | any;
};

type Nurse = {
  id: number;
  user: User | any;
};

type Specialty = {
  id: number;
  title: string;
  doctors: Doctor[] | any;
  symptom: Symptom | any;
};

type Symptom = {
  id: number;
  title: string;
  specialty: Specialty | any;
};

type Queue = {
  id: number;
  title: string;
  user: User | any;
  symptom: Symptom | any;
  doctor: Doctor | any;
  date: string;
};

type Treatment = {
  id: number;
  patient: Patient | any;
  doctor: Doctor | any;
  date: string;
  symptom: Symptom | any;
  details: string;
};

const RoleModel = Model.extend(<Partial<Role>>{});

const UserModel = Model.extend(<Partial<User>>{
  roles: hasMany(),
  patient: belongsTo(),
  doctor: belongsTo(),
  nurse: belongsTo(),
  profile: belongsTo(),
  queues: hasMany(),
});

const UserDTOModel = Model.extend(<Partial<Userdto>>{
  user: belongsTo(),
});
const ProfileModel = Model.extend(<Partial<Profile>>{
  user: belongsTo(),
});

const PatientModel = Model.extend(<Partial<Patient>>{
  user: belongsTo(),
  symptom: belongsTo(),
});

const DoctorModel = Model.extend(<Partial<Doctor>>{
  user: belongsTo(),
  specialties: hasMany(),
});

const NurseModel = Model.extend(<Partial<Nurse>>{
  user: belongsTo(),
});

const SpecialtyModel = Model.extend(<Partial<Specialty>>{
  doctors: hasMany(),
  symptom: belongsTo(),
});

const SymptomModel = Model.extend(<Partial<Symptom>>{
  specialty: belongsTo(),
});

const QueueModel = Model.extend(<Partial<Queue>>{
  user: belongsTo(),
  doctor: belongsTo(),
  symptom: belongsTo(),
});

const TreatmentModel = Model.extend(<Partial<Treatment>>{});

const UserFactory = Factory.extend({});
const RoleFactory = Factory.extend({});
const UserDTOFactory = Factory.extend({});
const DoctorFactory = Factory.extend({});
const NurseFactory = Factory.extend({});
const PatientFactory = Factory.extend({});
const ProfileFactory = Factory.extend({});
const SpecialtyFactory = Factory.extend({});
const QueueFactory = Factory.extend({});
const SymptomFactory = Factory.extend({});
const TreatmentFactory = Factory.extend({});

type AppRegistry = Registry<
  {
    role: typeof RoleModel;
    user: typeof UserModel;
    patient: typeof PatientModel;
    doctor: typeof DoctorModel;
    specialty: typeof SpecialtyModel;
    symptom: typeof SymptomModel;
    queue: typeof QueueModel;
    treatment: typeof TreatmentModel;
    userdto: typeof UserDTOModel;
    nurse: typeof NurseModel;
    profile: typeof ProfileModel;
  },
  {
    user: typeof UserFactory;
    role: typeof RoleFactory;
    userdto: typeof UserDTOFactory;
    doctor: typeof DoctorFactory;
    nurse: typeof NurseFactory;
    patient: typeof PatientFactory;
    profile: typeof ProfileFactory;
    specialty: typeof SpecialtyFactory;
    queue: typeof QueueFactory;
    symptom: typeof SymptomFactory;
    treatment: typeof TreatmentFactory;
  }
>;
type AppSchema = Schema<AppRegistry>;

const DEFAULT_ROLES = [
  { id: 1, title: 'ROLE_PATIENT' },
  { id: 2, title: 'ROLE_DOCTOR' },
  {
    id: 3,
    title: 'ROLE_NURSE',
  },
  { id: 4, title: 'ROLE_ADMIN' },
];
const DEFAULT_USERS = [
  {
    id: 1,
    username: 'admin',
    password: '12345678',
    roleIds: [4],
    nurseId: 1,
    profileId: 1,
  },
  {
    id: 2,
    username: 'nurse1',
    password: '12345678',
    roleIds: [3],
    nurseId: 1,
    profileId: 2,
  },
  {
    id: 3,
    username: 'nurse2',
    password: '12345678',
    roleIds: [3],
    nurseId: 2,
    profileId: 3,
  },
  {
    id: 4,
    username: 'patient1',
    password: '12345678',
    roleIds: [1],
    patientId: 1,
    profileId: 4,
  },
  {
    id: 5,
    username: 'patient2',
    password: '12345678',
    roleIds: [1],
    patientId: 2,
    profileId: 5,
  },
  {
    id: 6,
    username: 'doctor1',
    password: '12345678',
    roleIds: [2],
    doctorId: 1,
    profileId: 6,
  },
  {
    id: 7,
    username: 'doctor2',
    password: '12345678',
    roleIds: [2],
    doctorId: 2,
    profileId: 7,
  },
  {
    id: 8,
    username: 'doctor3',
    password: '12345678',
    roleIds: [2],
    doctorId: 3,
    profileId: 8,
  },
  {
    id: 9,
    username: 'doctor4',
    password: '12345678',
    roleIds: [2],
    doctorId: 4,
    profileId: 9,
  },
  {
    id: 10,
    username: 'doctor5',
    password: '12345678',
    roleIds: [2],
    doctorId: 5,
    profileId: 10,
  },
  {
    id: 11,
    username: 'doctor6',
    password: '12345678',
    roleIds: [2],
    doctorId: 6,
    profileId: 11,
  },
  {
    id: 12,
    username: 'doctor7',
    password: '12345678',
    roleIds: [2],
    doctorId: 7,
    profileId: 12,
  },
  {
    id: 13,
    username: 'doctor8',
    password: '12345678',
    roleIds: [2],
    doctorId: 8,
    profileId: 13,
  },
  {
    id: 14,
    username: 'doctor9',
    password: '12345678',
    roleIds: [2],
    doctorId: 9,
    profileId: 14,
  },
  {
    id: 15,
    username: 'doctor10',
    password: '12345678',
    roleIds: [2],
    doctorId: 10,
    profileId: 15,
  },
];
const DEFAULT_PROFILES = [
  {
    id: 1,
    name: faker.name.findName(),
  },
  {
    id: 2,
    name: faker.name.findName(),
  },
  {
    id: 3,
    name: faker.name.findName(),
  },
  {
    id: 4,
    name: faker.name.findName(),
  },
  {
    id: 5,
    name: faker.name.findName(),
  },
  {
    id: 6,
    name: faker.name.findName(),
  },
  {
    id: 7,
    name: faker.name.findName(),
  },
  {
    id: 8,
    name: faker.name.findName(),
  },
  {
    id: 9,
    name: faker.name.findName(),
  },
  {
    id: 10,
    name: faker.name.findName(),
  },
  {
    id: 11,
    name: faker.name.findName(),
  },
  {
    id: 12,
    name: faker.name.findName(),
  },
  {
    id: 13,
    name: faker.name.findName(),
  },
  {
    id: 14,
    name: faker.name.findName(),
  },
  {
    id: 15,
    name: faker.name.findName(),
  },
];
const DEFAULT_DOCTORS = [
  {
    id: 1,
    specialtyIds: [1],
    userId: 6,
  },
  {
    id: 2,
    specialtyIds: [2],
    userId: 7,
  },
  {
    id: 3,
    specialtyIds: [3],
    userId: 8,
  },
  {
    id: 4,
    specialtyIds: [4],
    userId: 9,
  },
  {
    id: 5,
    specialtyIds: [5],
    userId: 10,
  },
  {
    id: 6,
    specialtyIds: [6],
    userId: 11,
  },
  {
    id: 7,
    specialtyIds: [7],
    userId: 12,
  },
  {
    id: 8,
    specialtyIds: [8],
    userId: 13,
  },
  {
    id: 9,
    specialtyIds: [9],
    userId: 14,
  },
  {
    id: 10,
    specialtyIds: [10],
    userId: 15,
  },
];
const DEFAULT_PATIENTS = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];
const DEFAULT_NURSES = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];
const DEFAULT_SYMPTOMS = [
  { id: 1, title: 'โรคทั่วไป', specialtyId: 1 },
  { id: 2, title: 'โรคเกี่ยวกับเด็ก', specialtyId: 2 },
  {
    id: 3,
    title: 'โรคเกี่ยวกับระบบประสาท,ปวดหัว,ปวดคอ,ความดัน เป็นต้น',
    specialtyId: 3,
  },
  { id: 4, title: 'โรคเครียด', specialtyId: 4 },
  { id: 5, title: 'โรคเกี่ยวกับผู้หญิง', specialtyId: 5 },
  { id: 6, title: 'โรคเกี่ยวกับเพศ', specialtyId: 6 },
  { id: 7, title: 'โรคเกี่ยวกับผิวหนัง', specialtyId: 7 },
  { id: 8, title: 'โรคทางโภชนาการ', specialtyId: 8 },
  { id: 9, title: 'โรคเวชศาสตร์ฟื้นฟู, กายภาพบำบัด', specialtyId: 9 },
  {
    id: 10,
    title: 'โรคที่เกี่ยวข้องกับสัตว์เลี้ยง',
    specialtyId: 10,
  },
];
const DEFAULT_SPECIALTIES = [
  { id: 1, title: 'แพทย์ทั่วไป', doctorIds: [1], symptomId: 1 },
  { id: 2, title: 'แพทย์เด็ก', doctorIds: [2], symptomId: 2 },
  {
    id: 3,
    title: 'แพทย์ศัลยประสาท',
    doctorIds: [3],
    symptomId: 3,
  },
  {
    id: 4,
    title: 'จิตแพทย์',
    doctorIds: [4],
    symptomId: 4,
  },
  {
    id: 5,
    title: 'นรีแพทย์',
    doctorIds: [5],
    symptomId: 5,
  },
  {
    id: 6,
    title: 'แพทย์ผู้เชี่ยวชาญทางเพศ',
    doctorIds: [6],
    symptomId: 6,
  },
  {
    id: 7,
    title: 'แพทย์เสริมสวย',
    doctorIds: [7],
    symptomId: 7,
  },
  {
    id: 8,
    title: 'แพทย์นักโภชนาการ',
    doctorIds: [8],
    symptomId: 8,
  },
  {
    id: 9,
    title: 'แพทย์เชี่ยวชาญด้านการออกกำลังกาย',
    doctorIds: [9],
    symptomId: 9,
  },
  {
    id: 10,
    title: 'สัตวแพทย์',
    doctorIds: [10],
    symptomId: 10,
  },
];
const DEFAULT_QUEUES = [
  {
    id: 1,
    title: 'A001',
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    userId: 4,
    symptomId: 1,
    doctorId: 1,
  },
  {
    id: 2,
    title: 'A002',
    date: moment().add(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
    userId: 5,
    symptomId: 2,
    doctorId: 2,
  },
];

@Injectable({
  providedIn: 'root',
})
export class Backend2MockService implements OnDestroy {
  private server!: Server;

  constructor() {}

  async createServer() {
    const [
      load_roles,
      load_doctors,
      load_patients,
      load_specialties,
      load_symptoms,
      load_queues,
      load_treatments,
      load_users,
      load_nurses,
      load_profiles,
    ] = await getMany([
      'roles',
      'doctors',
      'patients',
      'specialties',
      'symptoms',
      'queues',
      'treatments',
      'users',
      'nurses',
      'profiles',
    ]);
    await setMany([
      ['roles', load_roles || DEFAULT_ROLES],
      ['specialties', load_specialties || DEFAULT_SPECIALTIES],
      ['doctors', load_doctors || DEFAULT_DOCTORS],
      ['patients', load_patients || DEFAULT_PATIENTS],
      ['symptoms', load_symptoms || DEFAULT_SYMPTOMS],
      ['queues', load_queues || DEFAULT_QUEUES],
      ['treatments', load_treatments || []],
      ['users', load_users || DEFAULT_USERS],
      ['nurses', load_nurses || DEFAULT_NURSES],
      ['profiles', load_profiles || DEFAULT_PROFILES],
    ]);
    /**
     * For save to indexed-db
     * @param key
     * @param values
     */
    const saveDb = (key: string, values: any) =>
      set(
        key,
        values.map((e: any) => e)
      );
    if (this.server) {
      this.server.shutdown();
    }
    this.server = createServer({
      serializers: {
        application: RestSerializer.extend({
          include: [
            'roles',
            'user',
            'nurse',
            'patient',
            'doctor',
            'profile',
            'doctors',
            'symptom',
            'specialty',
          ],
          embed: true,
          root: false,
        }),
        // user: RestSerializer.extend({
        //   include: ['roles'],
        //   embed: true,
        //   root: false,
        // }),
        // userdto: RestSerializer.extend({
        //   include: ['user'],
        //   embed: true,
        //   root: false,
        // }),
      },
      models: {
        role: RoleModel,
        doctor: DoctorModel,
        patient: PatientModel,
        specialty: SpecialtyModel,
        symptom: SymptomModel,
        queue: QueueModel,
        treatment: TreatmentModel,
        user: UserModel,
        userdto: UserDTOModel,
        nurse: NurseModel,
        profile: ProfileModel,
      },
      factories: {
        user: UserFactory,
        role: RoleFactory,
        userdto: UserDTOFactory,
        doctor: DoctorFactory,
        patient: PatientFactory,
        nurse: NurseFactory,
        profile: ProfileFactory,
        specialty: SpecialtyFactory,
        queue: QueueFactory,
        symptom: SymptomFactory,
        treatment: TreatmentFactory,
      },

      seeds(server) {
        server.db.loadData({
          roles: load_roles || DEFAULT_ROLES,
          specialties: load_specialties || DEFAULT_SPECIALTIES,
          doctors: load_doctors || DEFAULT_DOCTORS,
          patients: load_patients || DEFAULT_PATIENTS,
          symptoms: load_symptoms || DEFAULT_SYMPTOMS,
          queues: load_queues || DEFAULT_QUEUES,
          treatments: load_treatments || [],
          users: load_users || DEFAULT_USERS,
          nurses: load_nurses || DEFAULT_NURSES,
          profiles: load_profiles || DEFAULT_PROFILES,
        });
      },
      async routes() {
        this.namespace = 'api';

        const authenticate = (request: any) => {
          const header = request.requestHeaders;
          const authorization = header['Authorization'] || null;
          return authorization !== null;
        };
        /*
         * Specialty
         */
        this.get('specialties', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          return schema.all('specialty');
        });
        /*
         * Patient
         */
        this.get('symptoms', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          return schema.all('symptom');
        });
        /*
         * Queue
         */
        this.get('queues', (schema: AppSchema, request) => {
          return schema.all('queue');
        });
        this.post('queues', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const attrs = JSON.parse(request.requestBody);
          const queue = schema.create('queue', {
            ...attrs,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            title: 'A001',
          });
          saveDb('queues', schema.db.queues);
          return queue;
        });
        /*
         * Login
         */
        this.post('login', (schema: AppSchema, request) => {
          const { username, password } = JSON.parse(request.requestBody);
          let user: any = schema.findBy('user', { username, password });
          if (user) {
            let userDTO = schema.findBy('userdto', { token: FAKE_JWT_TOKEN });
            if (!userDTO) {
              userDTO = schema.create('userdto', {
                user: user,
                valid: true,
                token: FAKE_JWT_TOKEN,
              });
            } else {
              userDTO.update('user', user);
            }
            return new Response(201, undefined, userDTO);
          } else {
            return new Response(201, undefined, { valid: false });
          }
        });
        /*
         * Register
         */
        this.post('register', async (schema, request) => {
          const attrs = JSON.parse(request.requestBody);
          const username = schema.findBy('user', {
            username: attrs.username,
          });
          if (!username) {
            let user = schema.create('user', attrs);
            await saveDb('users', schema.db.users);
            if (user) {
              delete user.attrs.password;
              return new Response(201, undefined, true);
            } else {
              return new Response(201, undefined, false);
            }
          }
          return new Response(201, undefined, false);
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.server) {
      this.server.shutdown();
    }
  }
}
