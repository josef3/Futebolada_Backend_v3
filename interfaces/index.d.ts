import { Request, Response, NextFunction } from 'express';

export interface IRequest extends Request {}

export interface IResponse extends Response {}

export interface INext extends NextFunction {}
