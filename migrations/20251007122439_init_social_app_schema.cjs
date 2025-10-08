
exports.up = async function (knex) {
    // USERS
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username", 45).notNullable();
        table.string("email", 100).notNullable().unique();
        table.string("password", 200).notNullable();
        table.string("name", 45).notNullable();
        table.string("coverPic", 100);
        table.string("profilePic", 100);
        table.string("city", 45);
        table.string("website", 45);
    });

    // POSTS
    await knex.schema.createTable("posts", (table) => {
        table.increments("id").primary();
        table.string("desc", 200);
        table.string("img", 200);
        table
            .integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.dateTime("createdAt");
    });

    // COMMENTS
    await knex.schema.createTable("comments", (table) => {
        table.increments("id").primary();
        table.string("desc", 200).notNullable();
        table.dateTime("createdAt");
        table
            .integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table
            .integer("postId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });

    // STORIES
    await knex.schema.createTable("stories", (table) => {
        table.increments("id").primary();
        table.string("img", 200);
        table
            .integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });

    // RELATIONSHIPS
    await knex.schema.createTable("relationships", (table) => {
        table.increments("id").primary();
        table
            .integer("followerUserId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table
            .integer("followedUserId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });

    // LIKES
    await knex.schema.createTable("likes", (table) => {
        table.increments("id").primary();
        table
            .integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table
            .integer("postId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });
};

exports.down = async function (knex) {
    await knex.schema
        .dropTableIfExists("likes")
        .dropTableIfExists("relationships")
        .dropTableIfExists("stories")
        .dropTableIfExists("comments")
        .dropTableIfExists("posts")
        .dropTableIfExists("users");
};
