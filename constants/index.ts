// AgHOAi1qMEYTCKQ8

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DevFlow'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const sidebarLinks = [
    {
        imgURL: "/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/icons/users.svg",
        route: "/community",
        label: "Community",
    },
    {
        imgURL: "/icons/star.svg",
        route: "/collection",
        label: "Collections",
    },
    {
        imgURL: "/icons/suitcase.svg",
        route: "/jobs",
        label: "Find Jobs",
    },
    {
        imgURL: "/icons/tag.svg",
        route: "/tags",
        label: "Tags",
    },
    {
        imgURL: "/icons/user.svg",
        route: "/profile",
        label: "Profile",
    },
    {
        imgURL: "/icons/question.svg",
        route: "/ask-question",
        label: "Ask a question",
    },
];

export const BADGE_CRITERIA = {
    QUESTION_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    QUESTION_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    TOTAL_VIEWS: {
        BRONZE: 1000,
        SILVER: 10000,
        GOLD: 100000,
    },
};