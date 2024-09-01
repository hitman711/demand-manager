// Define the type for a single row of data
export interface Rule {
    id: number;
    name: string;
    network: number;
    condition: string;
    bidScore: number;
    bidScoreType: string;
    status: boolean;
}

export interface Bid {
    id: number;
    network: number;
    DealID: number;
    SeatID: number;
    Bidder: string;
    Advertiser: string;
    CampaignID: number;
    BidScore: number;
    match?: string;
    newScore?: number;
    ruleIDs?: number[];
}
