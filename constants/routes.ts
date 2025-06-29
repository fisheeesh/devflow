const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ASK_QUESTION: 'ask-question',
    PROFILE: (id: string) => `/profile/${id}`,
    QUESTION: (id: string) => `/question/${id}`,
    TAGS: (id: string) => `/tags/${id}`,
    SIGNIN_WITH_OAUTH: 'signin-with-oauth',
};

export default ROUTES;
