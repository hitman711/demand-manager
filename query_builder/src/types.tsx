// Define the type for a single row of data
export interface Rule {
    id: string;
    name: string;
    network: string;
    condition: string;
    bidScore: number;
    bidScoreType: string;
    status: boolean;
}

export interface Bid {
    id: string;
    network: string;
    networkName: string;
    dealId?: string;
    seatId: string;
    bidder: string;
    bidBuyer: string;
    advertiser: string;
    campaignId: string;
    bidScore: number;
    match?: string;
    newScore?: number;
    ruleIDs?: number[];
}
