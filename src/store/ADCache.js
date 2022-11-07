// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
// 20200902 T. Jannak
// Keep a cache of key-identifyable, server-returned data sets
// This is separate from the rerender states/props that need the CURRENTLY SELECTED item or set
//
export const ADCache = {
    ProjectList: {},
    AreaList: {},
    TopicList: {},
    SubTopicList: {},
    QuestionKey: {},
    ResetAreas: false,
    ResetTopics: false,
    ResetSubTopics: false,
    disableSubmit: false,
    selectionType: '',
    selectedItemDPID:[],  // per topic
    selectedAreaIndex: 0,  // For SELECT dropdown index caching versus AID
    selectTooltip: true,
    emailParticipantAIDCache: {},
    servicePricing: null,
    DiscountBETA: null,
    Discount2X: null,
    Discount3X: null,
    CYCenabled: false,
    CYCprice: null,
    CYEenabled: false,
    CYEprice: null,
    TDCenabled: false,
    TDCprice: null,
    TDEenabled: false,
    TDEprice: null,
    ITCenabled: false,
    ITCprice: null,
    ITEenabled: false,
    ITEprice: null,
    STOpenSourceEnabled: false,
    STOSprice: "TBD",
    STCodeQualEnabled: false,
    STCQprice: "TBD",
    STSecuredCodingEnabled: false,
    STSCprice: "TBD"
};

export const AUTO_SELECT = 'AUTO';
export const MANUAL_SELECT = 'MANUAL';

export default ADCache;
//
//Alternatively useMemo if that works better but this is pretty straightforward as well
