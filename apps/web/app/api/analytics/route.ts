import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/api";
import { getServerSession } from "@/lib/session";
import { getStudyAnalytics } from "@/lib/analytics";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return err("unauthorized", "Unauthorized", 401);
    }

    // Parse query parameters for date range
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Default to last 30 days if not provided
    let start: string, end: string;
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29); // Last 30 days
      start = start.toISOString().split('T')[0];
      end = end.toISOString().split('T')[0];
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return err("invalid_date", "Dates must be in YYYY-MM-DD format", 400);
    }

    const analyticsData = await getStudyAnalytics(session.student.id, start, end);
    return ok(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return err("server_error", "Failed to fetch analytics", 500);
  }
}