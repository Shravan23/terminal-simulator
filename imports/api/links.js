import { Mongo } from 'meteor/mongo';

export const LinksCollection = new Mongo.Collection('links');
export const OutputCollection = new Mongo.Collection('terminalOutput');