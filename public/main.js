"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const helmet_1 = require("helmet");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 3600000,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
