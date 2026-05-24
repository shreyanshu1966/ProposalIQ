export interface SampleRFP {
  title: string;
  industry: string;
  emoji: string;
  text: string;
}

export const SAMPLE_RFPS: SampleRFP[] = [
  {
    title: "Cloud Migration",
    industry: "Healthcare",
    emoji: "🏥",
    text: `REQUEST FOR PROPOSAL — Cloud Migration Services
Client: State Department of Health
Issued: May 1, 2026
Deadline: June 30, 2026

1. OVERVIEW
The State Department of Health seeks a qualified vendor to migrate its legacy on-premise EHR system (500TB) to AWS GovCloud. The system serves 40 hospitals and 2M patients statewide.

2. SCOPE OF WORK
- Full infrastructure migration from on-premise to AWS GovCloud
- Zero-downtime migration with rollback capability
- HIPAA and HITECH compliance throughout
- Staff training (200+ users)
- 12 months post-migration support

3. REQUIREMENTS
- Vendor must hold ISO 27001 certification
- AWS Advanced Partner or higher
- Prior experience migrating healthcare data (minimum 2 references)
- Dedicated project manager and AWS architect
- 99.9% uptime SLA post-migration
- Delivery within 6 months of contract signing

4. BUDGET
Fixed price not to exceed $2,500,000.

5. SUBMISSION
Submit by June 30, 2026 to rfp@health.state.gov`,
  },
  {
    title: "AI Platform Build",
    industry: "Finance",
    emoji: "🏦",
    text: `REQUEST FOR PROPOSAL — AI-Powered Fraud Detection Platform
Client: National Credit Union Association
Issued: May 10, 2026
Deadline: July 15, 2026

1. BACKGROUND
NCUA requires an AI/ML fraud detection platform to monitor real-time transactions across 3,500 member credit unions processing $850B annually.

2. SCOPE
- Real-time transaction scoring (sub-100ms latency)
- ML model training pipeline with monthly retraining
- Integration with existing core banking systems (Fiserv, Jack Henry)
- SOC 2 Type II and PCI-DSS compliance
- Explainable AI dashboard for compliance officers
- 24/7 monitoring and alerting

3. TECHNICAL REQUIREMENTS
- Process minimum 2 million transactions per day
- False positive rate below 0.1%
- REST API and webhook integration support
- On-premise or private cloud deployment
- Full audit trail for regulatory reporting

4. TEAM REQUIREMENTS
- Lead ML Engineer with 5+ years fraud detection experience
- Dedicated customer success manager
- 4-hour SLA for critical incidents

5. BUDGET
$1.8M implementation + $250K/year maintenance.

6. DEADLINE
Proposals due July 15, 2026.`,
  },
  {
    title: "DevOps Modernization",
    industry: "Government",
    emoji: "🏛️",
    text: `REQUEST FOR PROPOSAL — DevOps Modernization & CI/CD Implementation
Client: Department of Transportation
Issued: May 5, 2026
Deadline: June 20, 2026

1. INTRODUCTION
The Department of Transportation seeks to modernize its software delivery pipeline across 12 internal applications currently using manual deployment processes causing 3-4 week release cycles.

2. OBJECTIVES
- Reduce release cycle from 4 weeks to 2 days
- Implement automated testing with 80%+ code coverage
- Containerize all 12 applications (Docker/Kubernetes)
- Establish GitOps workflow with approval gates
- Security scanning integrated into pipeline (SAST/DAST)

3. REQUIREMENTS
- Vendor must have FedRAMP authorization or be in process
- Experience with government IT modernization projects
- Kubernetes certification (CKA) for lead engineer
- Security clearance may be required
- Knowledge transfer and documentation included
- 90-day hypercare period post go-live

4. DELIVERABLES
- CI/CD pipeline for all 12 applications
- Container registry setup
- Runbooks and documentation
- Team training (30 engineers)

5. CONTRACT VALUE
Time & materials, estimated $800,000 over 8 months.

6. SUBMISSION DEADLINE
June 20, 2026 at 5:00 PM EST.`,
  },
  {
    title: "Data Platform",
    industry: "Retail",
    emoji: "🛒",
    text: `REQUEST FOR PROPOSAL — Enterprise Data Platform & Analytics
Client: RetailCo Inc. (Fortune 500 Retailer)
Issued: May 15, 2026
Deadline: July 1, 2026

1. BUSINESS CONTEXT
RetailCo operates 700+ stores across North America. We generate 50GB of transactional data daily but lack a unified data platform for real-time insights. This results in delayed inventory decisions and missed revenue opportunities estimated at $40M annually.

2. SCOPE OF WORK
- Design and implement a modern data lakehouse (Databricks or Snowflake)
- Real-time data ingestion from 700 POS systems
- Customer 360 analytics dashboard
- Demand forecasting ML models
- Self-service BI for non-technical business users
- GDPR/CCPA compliance layer

3. REQUIREMENTS
- Proven retail analytics experience (minimum 3 references)
- Databricks Partner or Snowflake Partner certification
- Data governance framework included
- Support 500 concurrent BI users
- Sub-5 second dashboard query response

4. SUCCESS METRICS
- Inventory accuracy improvement of 15%
- Report generation time reduced from hours to minutes
- Platform ready within 9 months

5. BUDGET
Up to $3,200,000 total project cost.

6. PROPOSALS DUE
July 1, 2026.`,
  },
];
