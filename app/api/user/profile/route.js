import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const user = await User.findOne({
      $or: [{ _id: session.user.id }, { email: session.user.email }],
    })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image, currentPassword, newPassword } = await req.json();

    await connectDb();
    const user = await User.findOne({
      $or: [{ _id: session.user.id }, { email: session.user.email }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name
    if (name && typeof name === "string") {
      user.name = name.trim();
    }

    // Update avatar image
    if (image !== undefined && typeof image === "string") {
      user.image = image.trim();
    }

    // Handle password change if requested
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // If user currently has a password, verify current password
      if (user.password) {
        if (!currentPassword) {
          return NextResponse.json(
            { error: "Please enter your current password" },
            { status: 400 }
          );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json(
            { error: "Incorrect current password" },
            { status: 400 }
          );
        }
      }

      // Hash and set new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
