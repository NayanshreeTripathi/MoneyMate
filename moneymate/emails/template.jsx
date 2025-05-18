import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
    userName = "",
    type = "monthly-report",
    data = {}
}) {
    if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={style.body}>
          <Container style={style.container}>
            <Heading style={style.title}>Monthly Financial Report</Heading>

            <Text style={style.text}>Hello {userName},</Text>
            <Text style={style.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={style.statsContainer}>
              <div style={style.stat}>
                <Text style={style.text}>Total Income</Text>
                <Text style={style.heading}>${data?.stats.totalIncome}</Text>
              </div>
              <div style={style.stat}>
                <Text style={style.text}>Total Expenses</Text>
                <Text style={style.heading}>${data?.stats.totalExpenses}</Text>
              </div>
              <div style={style.stat}>
                <Text style={style.text}>Net</Text>
                <Text style={style.heading}>
                  ${data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={style.section}>
                <Heading style={style.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={style.row}>
                      <Text style={style.text}>{category}</Text>
                      <Text style={style.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={style.section}>
                <Heading style={style.heading}>MoneyMate Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={style.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={style.footer}>
              Thank you for using MoneMate. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
    if(type === "budget-alert"){
      return (
    <Html>
      <Head/>
      <Preview>Budget Alert</Preview>
      <Body style={style.body}>
        <Container style={style.container}>
            <Heading style={style.heading}>Budget-Alert</Heading>
            <Text style={style.text}>Hello {userName}</Text>
            <Text style={style.text}>
                This is a reminder that you have used {data?.percentageUsed.toFixed(1)}% of your budget for {data.accountName}. 
                Your total expenses this month are {data?.totalExpenses} out of {data?.budgetAmount}.
            </Text>
            <Section style={style.statsContainer}>
                <div style={style.stat}>
                    <Text style={style.text}>Budget Amount</Text>
                    <Text style={style.heading}>${data?.budgetAmount}</Text>
                </div>
                <div style={style.stat}>
                    <Text style={style.text}>Spent So Far</Text>
                    <Text style={style.heading}>${data?.totalExpenses}</Text>
                </div>
                <div style={style.stat}>
                    <Text style={style.text}>Remaining</Text>
                    <Text style={style.heading}>${data?.budgetAmount - data?.totalExpenses}</Text>
                </div>
            </Section>
        </Container>
      </Body>
    </Html>
     );      
   }
  
}
const style = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};