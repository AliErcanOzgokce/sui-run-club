module nft::nft;

use std::string::String;
use sui::table::{Self, Table};
use sui::package;
use sui::display;

public struct Badge has key {
    id: UID,
    name: String,
    description: String,
    image_url: String,
    runner_number: u64,
}

public struct NFT has drop {}

fun init(otw: NFT, ctx: &mut TxContext) {
    let keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"image_url".to_string(),
    ];

    let values = vector[
        b"{name}".to_string(),
        b"{description}".to_string(),
        b"{image_url}".to_string(),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<Badge>(
        &publisher,
        keys,
        values,
        ctx,
    );

    let number_table = table::new<u64, bool>(ctx);
    let address_table = table::new<address, bool>(ctx);

    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
    transfer::public_transfer(number_table, ctx.sender());
    transfer::public_transfer(address_table, ctx.sender());
}

public fun claim(
    name: String,
    description: String,
    image_url: String,
    number_table: &mut Table<u64, bool>,
    address_table: &mut Table<address, bool>,
    runner_number: u64,
    to: address,
    ctx: &mut TxContext,
) {
    assert!(!table::contains(number_table, runner_number), 1);
    assert!(!table::contains(address_table, to), 2);
    assert!(runner_number > 0 && runner_number <= 120, 3);

    table::add(number_table, runner_number, true);
    table::add(address_table, to, true);

    let badge = Badge {
        id: object::new(ctx),
        name,
        description,
        image_url,
        runner_number,
    };

    transfer::transfer(badge, to);
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(NFT {}, ctx);
}

#[test_only]
public fun title(badge: &Badge): String {
    badge.name
}

#[test_only]
public fun description(badge: &Badge): String {
    badge.description
}

#[test_only]
public fun image_url(badge: &Badge): String {
    badge.image_url
}

#[test_only]
public fun runner_number(badge: &Badge): u64 {
    badge.runner_number
}