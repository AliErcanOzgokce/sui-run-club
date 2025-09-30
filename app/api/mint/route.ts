import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { mintNFT } from '@/lib/sui'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { suiAddress, sbtNumber } = await request.json()
    
    console.log('API received request:');
    console.log('- SUI Address:', suiAddress);
    console.log('- SBT Number:', sbtNumber);
    console.log('- User:', session.user.name);

    if (!suiAddress || !sbtNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mint NFT
    const packageId = process.env.SUI_PACKAGE_ID!
    const numberTableId = process.env.SUI_NUMBER_TABLE_ID!
    const addressTableId = process.env.SUI_ADDRESS_TABLE_ID!
    
    console.log('Environment variables:');
    console.log('- Package ID:', packageId);
    console.log('- Number Table ID:', numberTableId);
    console.log('- Address Table ID:', addressTableId);
    
    const result = await mintNFT(packageId, suiAddress, sbtNumber, numberTableId, addressTableId)

    return NextResponse.json({ 
      success: true, 
      transaction: result,
      message: `Successfully minted SBT #${sbtNumber}` 
    })
  } catch (error) {
    console.error('Error minting NFT:', error)
    return NextResponse.json({ error: 'Failed to mint NFT' }, { status: 500 })
  }
}
