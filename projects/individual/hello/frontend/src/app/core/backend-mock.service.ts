import { Injectable, OnDestroy } from '@angular/core';
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

const FAKE_JWT_TOKEN = 'fake-jwt-token';

type Board = {
  title: string;
  todos: Todo[] | any;
  user: User | any;
};

type Todo = {
  title: string;
  board: Board | any;
  cards: Card[] | any;
  ordinal: number;
};

type Card = {
  title: string;
  todo: Todo | any;
  ordinal: number;
};

type User = {
  username: string;
  password: string;
  boards: Board[] | any;
};

const BoardModel = Model.extend(<Partial<Board>>{
  todos: hasMany(),
  user: belongsTo(),
  members: hasMany(),
});

const TodoModel = Model.extend(<Partial<Todo>>{
  board: belongsTo(),
  cards: hasMany(),
});

const CardModel = Model.extend(<Partial<Card>>{
  todo: belongsTo(),
});

const UserModel = Model.extend(<Partial<User>>{
  boards: hasMany(),
});

const BoardFactory = Factory.extend({
  title(i: number) {
    return `Board ${i + 1}`;
  },
});

const TodoFactory = Factory.extend({
  title(i: number) {
    return `Todo ${i + 1}`;
  },
  ordinal(i: number) {
    return i % 5;
  },
});
const CardFactory = Factory.extend({
  title(i: number) {
    return `Card ${i + 1}`;
  },
  ordinal(i: number) {
    return i % 5;
  },
});

const UserFactory = Factory.extend({});

type AppRegistry = Registry<
  {
    board: typeof BoardModel;
    todo: typeof TodoModel;
    card: typeof CardModel;
    user: typeof UserModel;
  },
  {
    board: typeof BoardFactory;
    todo: typeof TodoFactory;
    card: typeof CardFactory;
    user: typeof UserFactory;
  }
>;
type AppSchema = Schema<AppRegistry>;

@Injectable({
  providedIn: 'root',
})
export class BackendMockService implements OnDestroy {
  private server!: Server;

  constructor() {}

  async createServer() {
    const [boards, todos, cards, users] = await getMany([
      'boards',
      'todos',
      'cards',
      'users',
    ]);
    await setMany([
      ['boards', boards || []],
      ['todos', todos || []],
      ['cards', cards || []],
      ['users', users || [{ username: 'admin', password: 'admin123' }]],
    ]);
    if (this.server) {
      this.server.shutdown();
    }
    this.server = createServer({
      serializers: {
        todo: RestSerializer.extend({
          root: false,
          include: ['board', 'cards'],
          embed: true,
        }),
        board: RestSerializer.extend({
          include: ['todos'],
          embed: true,
          root: false,
        }),
        card: RestSerializer.extend({
          include: ['todo'],
          embed: true,
          root: false,
        }),
      },
      models: {
        board: BoardModel,
        todo: TodoModel,
        card: CardModel,
        user: UserModel,
      },
      factories: {
        board: BoardFactory,
        todo: TodoFactory,
        card: CardFactory,
        user: UserFactory,
      },

      seeds(server) {
        server.db.loadData({
          boards: boards || [],
          todos: todos || [],
          users: users || [{ username: 'admin', password: 'admin123' }],
          cards: cards || [],
        });
      },
      async routes() {
        this.namespace = 'api';
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

        const authenticate = (request: any) => {
          const header = request.requestHeaders;
          const authorization = header['Authorization'] || null;
          return authorization !== null;
        };

        /**
         * Boards
         */
        this.get('boards/user/:userId', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.userId;
          return schema.where('board', (board: any) => board.userId === id);
        });
        this.get('boards/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const board = schema.find('board', id);
          if (board) {
            return board;
          } else {
            return new Response(404);
          }
        });
        this.post('boards', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const attrs = JSON.parse(request.requestBody);
          const user = schema.find('user', attrs.userId);
          if (user) {
            const board = schema.create('board', attrs);
            user.boards.models.push(board);
            user.update('boards', user.boards.models);
            saveDb('boards', schema.db.boards);
            saveDb('users', schema.db.users);
            return board;
          } else {
            return new Response(404);
          }
        });
        this.put('boards/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          const board = schema.find('board', id);
          if (board) {
            board.update(attrs);
            saveDb('boards', schema.db.boards);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });

        this.delete('boards/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const board = schema.find('board', id);
          if (board) {
            if (board.todos) {
              board.todos.models.forEach((todo: any) => {
                if (todo.cards) {
                  todo.cards.destroy();
                }
              });
              board.todos.destroy();
            }
            board.destroy();
            saveDb('boards', schema.db.boards);
            saveDb('todos', schema.db.todos);
            saveDb('cards', schema.db.cards);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });
        /**
         * Todos
         */
        this.post('todos', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const attrs = JSON.parse(request.requestBody);
          const board = schema.find('board', attrs.boardId);
          if (board) {
            const todo = schema.create('todo', attrs);
            board.todos.models.push(todo);
            board.update('todos', board.todos.models);
            saveDb('todos', schema.db.todos);
            saveDb('boards', schema.db.boards);
            return todo;
          } else {
            return new Response(404);
          }
        });
        this.put('todos/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          let attrs = JSON.parse(request.requestBody);
          const todo = schema.find('todo', id);
          if (todo) {
            todo.update(attrs);
            saveDb('todos', schema.db.todos);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });
        this.delete('todos/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const todo = schema.find('todo', id);
          if (todo) {
            const todos = schema.where('todo', (c) => c.ordinal > todo.ordinal);
            todos.models.forEach((c: any) => {
              c.update({ ordinal: c.ordinal - 1 });
            });
            if (todo.cards) {
              todo.cards.destroy();
            }
            todo.destroy();
            saveDb('cards', schema.db.cards);
            saveDb('todos', schema.db.todos);
            saveDb('boards', schema.db.boards);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });
        this.put(
          '/todos/move/:boardId/:prev/:current',
          (schema: AppSchema, request) => {
            if (!authenticate(request)) {
              return new Response(401);
            }
            const boardId = request.params.boardId;
            const prev = Number(request.params.prev);
            const current = Number(request.params.current);
            const sortTodo = (todo1: any, todo2: any) => {
              if (todo1.ordinal < todo2.ordinal) return -1;
              else if (todo1.ordinal > todo2.ordinal) return 1;
              else return 0;
            };
            if (prev < current) {
              // drag down
              const todos = schema.where(
                'todo',
                (todo: any) =>
                  todo.ordinal >= prev &&
                  todo.ordinal <= current &&
                  todo.boardId === boardId
              );
              todos.models.sort(sortTodo);
              todos.models.forEach((todo: any, i: number) => {
                if (i === 0) {
                  todo.update({ ordinal: current });
                } else {
                  todo.update({ ordinal: todo.ordinal - 1 });
                }
              });
            } else {
              // drag up
              const todos = schema.where(
                'todo',
                (todo: any) =>
                  todo.ordinal >= current &&
                  todo.ordinal <= prev &&
                  todo.boardId === boardId
              );
              todos.models.sort(sortTodo);
              todos.models.forEach((todo: any, i: number) => {
                if (i === todos.models.length - 1) {
                  todo.update({ ordinal: current });
                } else {
                  todo.update({ ordinal: todo.ordinal + 1 });
                }
              });
            }
            saveDb('todos', schema.db.todos);
            saveDb('boards', schema.db.boards);
            return new Response(204);
          }
        );
        /**
         * Cards
         */
        this.post('cards', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const attrs = JSON.parse(request.requestBody);
          const todo = schema.find('todo', attrs.todoId);
          if (todo) {
            const card = schema.create('card', attrs);
            todo.cards.models.push(card);
            todo.update('cards', todo.cards.models);
            saveDb('cards', schema.db.cards);
            saveDb('todos', schema.db.todos);
            return card;
          } else {
            return new Response(404);
          }
        });
        this.put('cards/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          const card = schema.find('card', id);
          if (card) {
            card.update(attrs);
            saveDb('cards', schema.db.cards);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });
        this.delete('cards/:id', (schema: AppSchema, request) => {
          if (!authenticate(request)) {
            return new Response(401);
          }
          const id = request.params.id;
          const card = schema.find('card', id);
          if (card) {
            const cards = schema.where('card', (c) => c.ordinal > card.ordinal);
            cards.models.forEach((c: any) => {
              c.update({ ordinal: c.ordinal - 1 });
            });
            card.destroy();
            saveDb('cards', schema.db.cards);
            saveDb('todos', schema.db.todos);
            return new Response(204);
          } else {
            return new Response(404);
          }
        });
        this.put(
          '/cards/move/:todoId/:prev/:current',
          (schema: AppSchema, request) => {
            if (!authenticate(request)) {
              return new Response(401);
            }
            const todoId = request.params.todoId;
            const prev = Number(request.params.prev);
            const current = Number(request.params.current);
            const sortCard = (card1: any, card2: any) => {
              if (card1.ordinal < card2.ordinal) return -1;
              else if (card1.ordinal > card2.ordinal) return 1;
              else return 0;
            };
            if (prev < current) {
              // drag down
              const cards = schema.where(
                'card',
                (card: any) =>
                  card.ordinal >= prev &&
                  card.ordinal <= current &&
                  card.todoId === todoId
              );
              cards.models.sort(sortCard);
              cards.models.forEach((card: any, i: number) => {
                if (i === 0) {
                  card.update({ ordinal: current });
                } else {
                  card.update({ ordinal: card.ordinal - 1 });
                }
              });
            } else {
              // drag up
              const cards = schema.where(
                'card',
                (card: any) =>
                  card.ordinal >= current &&
                  card.ordinal <= prev &&
                  card.todoId === todoId
              );
              cards.models.sort(sortCard);
              cards.models.forEach((card: any, i: number) => {
                if (i === cards.models.length - 1) {
                  card.update({ ordinal: current });
                } else {
                  card.update({ ordinal: card.ordinal + 1 });
                }
              });
            }
            saveDb('cards', schema.db.cards);
            saveDb('todos', schema.db.todos);
            return new Response(204);
          }
        );
        this.put(
          'cards/transfer/:id/:prevTodoId/:currentTodoId/:prev/:current',
          (schema: AppSchema, request) => {
            if (!authenticate(request)) {
              return new Response(401);
            }
            const id = request.params.id;
            const prevTodoId = request.params.prevTodoId;
            const currentTodoId = request.params.currentTodoId;
            const prev = Number(request.params.prev);
            const current = Number(request.params.current);
            const card = schema.find('card', id);
            const currentTodo = schema.find('todo', currentTodoId);
            const sortCard = (card1: any, card2: any) => {
              if (card1.ordinal < card2.ordinal) return -1;
              else if (card1.ordinal > card2.ordinal) return 1;
              else return 0;
            };

            if (card) {
              //update card ordinal of previous todolist
              const oldCards = schema.where(
                'card',
                (card: any) => card.ordinal > prev && card.todoId === prevTodoId
              );
              oldCards.models.sort(sortCard);
              oldCards.models.forEach((card: any) => {
                card.update({ ordinal: card.ordinal - 1 });
              });
              //update card ordinal of current todolist
              const newCards = schema.where(
                'card',
                (card: any) =>
                  card.ordinal >= current && card.todoId === currentTodoId
              );
              newCards.models.sort(sortCard);
              oldCards.models.forEach((card: any) => {
                card.update({ ordinal: card.ordinal + 1 });
              });
              card.update({ ordinal: current });
              if (currentTodo) {
                card.update({ todo: currentTodo });
              }
              saveDb('cards', schema.db.cards);
              saveDb('todos', schema.db.todos);
            }

            return new Response(204);
          }
        );
        /**
         * Login
         */
        this.post('login', async (schema, request) => {
          const { username, password } = JSON.parse(request.requestBody);
          let user = schema.findBy('user', { username, password });
          if (user) {
            delete user.attrs.password;
            return new Response(201, undefined, {
              user: user,
              token: FAKE_JWT_TOKEN,
              valid: true,
            });
          } else {
            return new Response(201, undefined, { valid: false });
          }
        });
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
