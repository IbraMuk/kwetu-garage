import { Invoice } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// Données mockées pour les factures
let invoices: Invoice[] = [
  {
    id: "B20e8400-e29b-41d4-a716-446655440001",
    client_id: "770e8400-e29b-41d4-a716-446655440001",
    repair_id: "A10e8400-e29b-41d4-a716-446655440001",
    invoice_number: "FAC-202405-0001",
    issue_date: "2024-05-01",
    due_date: "2024-05-15",
    subtotal: 51.4,
    tax_rate: 20.0,
    total_amount: 61.68,
    status: "paid",
    payment_method: "Carte bancaire",
    payment_date: "2024-05-01T10:30:00Z",
    notes: "Paiement immédiat",
    created_at: "2024-05-01T09:00:00Z",
    updated_at: "2024-05-01T10:30:00Z",
  },
  {
    id: "B20e8400-e29b-41d4-a716-446655440002",
    client_id: "770e8400-e29b-41d4-a716-446655440002",
    repair_id: "A10e8400-e29b-41d4-a716-446655440002",
    invoice_number: "FAC-202405-0002",
    issue_date: "2024-05-03",
    due_date: "2024-05-17",
    subtotal: 118.0,
    tax_rate: 20.0,
    total_amount: 141.6,
    status: "paid",
    payment_method: "Espèces",
    payment_date: "2024-05-03T14:15:00Z",
    notes: "Client régulier",
    created_at: "2024-05-03T13:30:00Z",
    updated_at: "2024-05-03T14:15:00Z",
  },
  {
    id: "B20e8400-e29b-41d4-a716-446655440003",
    client_id: "770e8400-e29b-41d4-a716-446655440003",
    repair_id: "A10e8400-e29b-41d4-a716-446655440003",
    invoice_number: "FAC-202405-0003",
    issue_date: "2024-05-10",
    due_date: "2024-05-24",
    subtotal: 67.5,
    tax_rate: 20.0,
    total_amount: 81.0,
    status: "pending",
    payment_method: undefined,
    payment_date: undefined,
    notes: "En attente de validation",
    created_at: "2024-05-10T08:00:00Z",
    updated_at: "2024-05-10T08:00:00Z",
  },
  {
    id: "B20e8400-e29b-41d4-a716-446655440004",
    client_id: "770e8400-e29b-41d4-a716-446655440004",
    repair_id: "A10e8400-e29b-41d4-a716-446655440004",
    invoice_number: "FAC-202405-0004",
    issue_date: "2024-05-05",
    due_date: "2024-05-19",
    subtotal: 145.0,
    tax_rate: 20.0,
    total_amount: 174.0,
    status: "paid",
    payment_method: "Virement bancaire",
    payment_date: "2024-05-06T09:30:00Z",
    notes: "Entreprise",
    created_at: "2024-05-05T16:00:00Z",
    updated_at: "2024-05-06T09:30:00Z",
  },
  {
    id: "B20e8400-e29b-41d4-a716-446655440006",
    client_id: "770e8400-e29b-41d4-a716-446655440007",
    repair_id: "A10e8400-e29b-41d4-a716-446655440007",
    invoice_number: "FAC-202405-0006",
    issue_date: "2024-05-06",
    due_date: "2024-05-20",
    subtotal: 256.0,
    tax_rate: 20.0,
    total_amount: 307.2,
    status: "overdue",
    payment_method: undefined,
    payment_date: undefined,
    notes: "Facture en retard",
    created_at: "2024-05-06T12:00:00Z",
    updated_at: "2024-05-06T12:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("client_id");

    let filteredInvoices = invoices;

    // Filtrer par client
    if (clientId) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.client_id === clientId,
      );
    }

    return NextResponse.json(filteredInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();

    // Validation basique
    if (
      !invoiceData.client_id ||
      !invoiceData.invoice_number ||
      !invoiceData.issue_date
    ) {
      return NextResponse.json(
        {
          error:
            "Le client, le numéro de facture et la date d'émission sont obligatoires",
        },
        { status: 400 },
      );
    }

    if (invoiceData.total_amount < 0) {
      return NextResponse.json(
        { error: "Le montant ne peut pas être négatif" },
        { status: 400 },
      );
    }

    // Créer la nouvelle facture
    const newInvoice: Invoice = {
      id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_id: invoiceData.client_id,
      repair_id: invoiceData.repair_id || null,
      invoice_number: invoiceData.invoice_number,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date || null,
      subtotal: invoiceData.subtotal || null,
      tax_rate: invoiceData.tax_rate || null,
      total_amount: invoiceData.total_amount,
      status: invoiceData.status || "pending",
      payment_method: invoiceData.payment_method || null,
      payment_date: invoiceData.payment_date || null,
      notes: invoiceData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    invoices.push(newInvoice);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture" },
      { status: 500 },
    );
  }
}
