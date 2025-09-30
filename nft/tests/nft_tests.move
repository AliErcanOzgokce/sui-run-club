#[test_only]
module nft::nft_tests {
    use nft::nft::{Self, Badge};
    use sui::test_scenario::{Self as ts, next_tx};
    use sui::table::{Table};

    // Error codes for assertions
    const EBadgeNotTransferred: u64 = 4;
    const ENameMismatch: u64 = 5;
    const EDescriptionMismatch: u64 = 6;
    const EImageUrlMismatch: u64 = 7;
    const ERunnerNumberMismatch: u64 = 8;

    const ADMIN: address = @0x1;
    const USER1: address = @0x2;
    const USER2: address = @0x3;

    #[test]
    fun test_init() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Verify that all objects were created and transferred to admin
        assert!(ts::has_most_recent_for_address<Table<u64, bool>>(ADMIN), 0);
        assert!(ts::has_most_recent_for_address<Table<address, bool>>(ADMIN), 0);

        ts::end(scenario);
    }

    #[test]
    fun test_claim_badge() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims a badge for USER1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Test Runner".to_string(),
                b"Test Description".to_string(),
                b"https://example.com/badge.png".to_string(),
                &mut number_table,
                &mut address_table,
                1,
                USER1,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, USER1);

        // Verify badge was created and transferred to USER1
        assert!(ts::has_most_recent_for_address<Badge>(USER1), EBadgeNotTransferred);
        
        {
            let badge = ts::take_from_address<Badge>(&scenario, USER1);
            assert!(nft::title(&badge) == b"Test Runner".to_string(), ENameMismatch);
            assert!(nft::description(&badge) == b"Test Description".to_string(), EDescriptionMismatch);
            assert!(nft::image_url(&badge) == b"https://example.com/badge.png".to_string(), EImageUrlMismatch);
            assert!(nft::runner_number(&badge) == 1, ERunnerNumberMismatch);
            ts::return_to_address(USER1, badge);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure]
    fun test_claim_same_runner_number() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims a badge for USER1 with runner number 1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Test Runner 1".to_string(),
                b"Test Description 1".to_string(),
                b"https://example.com/badge1.png".to_string(),
                &mut number_table,
                &mut address_table,
                1,
                USER1,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, ADMIN);

        // Try to claim another badge with the same runner number 1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Test Runner 2".to_string(),
                b"Test Description 2".to_string(),
                b"https://example.com/badge2.png".to_string(),
                &mut number_table,
                &mut address_table,
                1, // Same runner number - should fail
                USER2,
                scenario.ctx(),
            );
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure]
    fun test_claim_same_address() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims a badge for USER1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Test Runner 1".to_string(),
                b"Test Description 1".to_string(),
                b"https://example.com/badge1.png".to_string(),
                &mut number_table,
                &mut address_table,
                1,
                USER1,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, ADMIN);

        // Try to claim another badge for the same address USER1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Test Runner 2".to_string(),
                b"Test Description 2".to_string(),
                b"https://example.com/badge2.png".to_string(),
                &mut number_table,
                &mut address_table,
                2, // Different runner number
                USER1, // Same address - should fail
                scenario.ctx(),
            );
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_claim_multiple_badges_different_users() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims badge for USER1
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Runner 1".to_string(),
                b"First runner".to_string(),
                b"https://example.com/runner1.png".to_string(),
                &mut number_table,
                &mut address_table,
                1,
                USER1,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims badge for USER2
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            nft::claim(
                b"Runner 2".to_string(),
                b"Second runner".to_string(),
                b"https://example.com/runner2.png".to_string(),
                &mut number_table,
                &mut address_table,
                2,
                USER2,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, USER1);
        // Verify USER1 received their badge
        assert!(ts::has_most_recent_for_address<Badge>(USER1), EBadgeNotTransferred);

        next_tx(&mut scenario, USER2);
        // Verify USER2 received their badge
        assert!(ts::has_most_recent_for_address<Badge>(USER2), EBadgeNotTransferred);

        ts::end(scenario);
    }

    #[test]
    fun test_claim_multiple_badges_same_admin() {
        let mut scenario = ts::begin(ADMIN);
        
        // Initialize the NFT module
        {
            nft::init_for_test(scenario.ctx());
        };

        next_tx(&mut scenario, ADMIN);

        // Admin claims multiple badges for different users
        {
            let mut number_table = ts::take_from_address<Table<u64, bool>>(&scenario, ADMIN);
            let mut address_table = ts::take_from_address<Table<address, bool>>(&scenario, ADMIN);
            
            // Claim for USER1
            nft::claim(
                b"Runner 1".to_string(),
                b"First runner".to_string(),
                b"https://example.com/runner1.png".to_string(),
                &mut number_table,
                &mut address_table,
                1,
                USER1,
                scenario.ctx(),
            );
            
            // Claim for USER2
            nft::claim(
                b"Runner 2".to_string(),
                b"Second runner".to_string(),
                b"https://example.com/runner2.png".to_string(),
                &mut number_table,
                &mut address_table,
                2,
                USER2,
                scenario.ctx(),
            );
            
            ts::return_to_address(ADMIN, number_table);
            ts::return_to_address(ADMIN, address_table);
        };

        next_tx(&mut scenario, USER1);
        // Verify USER1 received their badge
        assert!(ts::has_most_recent_for_address<Badge>(USER1), EBadgeNotTransferred);

        next_tx(&mut scenario, USER2);
        // Verify USER2 received their badge
        assert!(ts::has_most_recent_for_address<Badge>(USER2), EBadgeNotTransferred);

        ts::end(scenario);
    }
}