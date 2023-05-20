export type EndPoint = {
  params?: {
    [k: string]: string | number;
  };
  body?: unknown;
  responseBody?: unknown;
};

export type EndPointRequest<T extends EndPoint = EndPoint> = Omit<
  T,
  'responseBody'
>;

export type LoginData = {
  name: string;
  password: string;
};

export type AccountDB = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type UserData = {
  account_id: number;
  account_name: string;
  token: string;
  created_at: string;
};

export type CanvasInit = {
  name: string;
  width: number;
  height: number;
  active_from: string;
  active_to: string;
};

export type CanvasDB = CanvasInit & {
  id: number;
  account_id: number;
  created_at: string;
  updated_at: string;
};

export type Resources = {
  account: {
    path: '/account';
    methods: {
      POST: {
        body: LoginData;
        responseBody: AccountDB;
      };
      GET: {
        params: {
          g_id: number;
        };
        responseBody: AccountDB;
      };
      PATCH: {
        body: Partial<LoginData>;
        responseBody: AccountDB;
      };
    };
  };
  login: {
    path: '/login';
    methods: {
      POST: {
        body: LoginData;
        responseBody: UserData;
      };
    };
  };
  canvas: {
    path: '/canvas';
    methods: {
      POST: {
        body: CanvasInit;
        responseBody: CanvasDB;
      };
    };
  };
  userCanvases: {
    path: '/canvas/my';
    methods: {
      GET: {
        responseBody: CanvasDB[];
      };
    };
  };
  canvasManagement: {
    path: `/canvas/${string | number}`;
    methods: {
      GET: {
        responseBody: CanvasDB;
      };
      PATCH: {
        body: Partial<CanvasInit>;
        responseBody: CanvasDB;
      };
    };
  };
  canvasData: {
    path: `/canvas/${string | number}/data`;
    methods: {
      POST: {
        body: {
          x: number;
          y: number;
          color: string;
        };
      };
      GET: {
        params?: {
          at?: string;
        };
        responseBody: string[][];
      };
    };
  };
  ping: {
    path: '/ping';
    methods: {
      GET: {
        responseBody: 'pong';
      };
    };
  };
};
