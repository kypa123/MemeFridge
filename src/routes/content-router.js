import { Router } from 'express';
import contentModel from '../db/models/content-model.js'

const contentRouter = Router();


contentRouter.get('/', async function(req, res, next){
    try{
        const result = await contentModel.find
    }
})