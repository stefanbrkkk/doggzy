import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/dogs - List all dog profiles with filters
export async function GET(_request: NextRequest) {
  try {
    // Mock data for now - replace with real implementation later
    const mockDogs = [
      {
        id: '1',
        name: 'Bella',
        breed: 'Golden Retriever',
        age: '2 godine',
        status: 'available',
        location: 'Beograd',
        description: 'Prijateljski pas koji voli decu',
        images: ['/api/placeholder/400/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2', 
        name: 'Max',
        breed: 'Labrador',
        age: '3 godine',
        status: 'adopted',
        location: 'Novi Sad',
        description: 'Energičan pas koji voli šetnje',
        images: ['/api/placeholder/400/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        dogs: mockDogs,
        total: mockDogs.length,
        hasMore: false
      }
    })

  } catch (error) {
    console.error('Dog profiles list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dog profiles',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/dogs - Create new dog profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.name || !body.breed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and breed are required',
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      )
    }

    // Mock creation - replace with real implementation later
    const newDog = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Dog profile created successfully',
      data: newDog
    }, { status: 201 })

  } catch (error) {
    console.error('Dog profile creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create dog profile',
        code: 'CREATE_ERROR'
      },
      { status: 500 }
    )
  }
}
