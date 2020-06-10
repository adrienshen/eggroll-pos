/**
 * Add POS_Stations, Sections, Squares
 * -------------------------------
 */

exports.up = async function (knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema
    .createTable("restaurants", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      t.integer("number"); // sequence: #1, #2
      t.string("name");
      t.string("address");
      t.boolean("delivery");
      t.boolean("takeout");
      t.boolean("dine_in");
      t.boolean("is_open");
      t.jsonb("extra_fields");
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at");

      t.integer("merchant_id").unsigned().notNullable().index();
      t.foreign("merchant_id")
        .references("id")
        .inTable("merchants")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");
    })
    .createTable("pos_stations", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("name");
      t.boolean("is_master");
      t.boolean("is_enabled");
      t.boolean("is_remote_locked");
      t.jsonb("extra_fields");
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at");

      t.integer("merchant_id").unsigned().notNullable().index();
      t.foreign("merchant_id")
        .references("id")
        .inTable("merchants")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");
      t.integer("restaurant_id").unsigned().notNullable().index();
      t.foreign("restaurant_id")
        .references("id")
        .inTable("restaurants")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");
    })
    .createTable("sections", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("name").notNullable();
      t.string("description");
      t.integer("position");
      t.string("color"); // #hex
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at");

      t.integer("station_id").unsigned().notNullable().index();
      t.foreign("station_id").references("id").inTable("pos_stations");
    })
    /**
     * `squares` can be moved around and position for best ease of use
     * positioning of `squares` can be set according to `pos_stations`
     * manually or based on dynamic data / ML
     */
    .createTable("squares", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      // The pos square position in the section
      t.integer("position");
      t.string("color"); // #hex

      t.integer("section_id").unsigned().notNullable().index();
      t.foreign("section_id").references("id").inTable("sections");
      t.integer("menu_item_id").unsigned().notNullable().index();
      t.foreign("menu_item_id").references("id").inTable("menu_items");
    })
    .createTable("tickets", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      t.integer("daily_sequence"); // resets every day
      t.integer("restaurant_sequence"); // increments at restaurant level
      t.integer("station_sequence"); // increments at pos_station level

      // tickets belong to `pos_stations` and `restaurants`
      t.integer("restaurant_id").unsigned().notNullable().index();
      t.foreign("restaurant_id")
        .references("id")
        .inTable("restaurants")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");
      t.integer("station_id").unsigned().notNullable().index();
      t.foreign("station_id")
        .references("id")
        .inTable("restaurants")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");

      /**
       * 1 or multiple `orders` are created from pos `tickets`
       * `order` should have fk to `tickets`
       */

      t.string("status"); // `completed`, `void`, `canceled`, `paid`
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at");
    })
    .createTable("pos_payments", (t) => {
      t.increments("id");
      t.uuid("uuid").defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("token");
      t.integer("amount_cents"); // `receipt.total_cents`
      t.string("type"); // `cash`, `credit`, `apple`, `google`, `gift_card`
      t.string("status"); // `success`, `failure`, `refunded`, `void`
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at"); // with manager privilage

      t.integer('ticket_id').unsigned().notNullable().index();
      t.foreign("ticket_id")
        .references("id")
        .inTable("tickets")
        .onUpdate("CASCADE")
        .onDelete("RESTRICT");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("squares")
    .dropTableIfExists("sections")
    .dropTableIfExists("pos_payments")
    .dropTableIfExists("tickets")
    .dropTableIfExists("pos_stations")
    .dropTableIfExists("restaurants")
};
