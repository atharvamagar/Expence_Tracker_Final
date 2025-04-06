import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getToken } from "next-auth/jwt"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("expenseTracker")
    const { description, amount, date, category } = await request.json()

    const expense = {
      userId: new ObjectId(token.id as string),
      description,
      amount: Number.parseFloat(amount),
      date,
      category,
      createdAt: new Date(),
    }

    const result = await db.collection("expenses").insertOne(expense)

    return NextResponse.json({ message: "Expense added successfully", id: result.insertedId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error adding expense" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("expenseTracker")
    
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    let query: any = {
      userId: new ObjectId(token.id as string)
    }

    if (month) {
      const startDate = new Date(`${month}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      
      query.date = {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    }

    const expenses = await db.collection("expenses").find(query).toArray()
    return NextResponse.json(expenses)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error fetching expenses" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("expenseTracker")
    const collection = db.collection("expenses")

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(token.id as string)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}