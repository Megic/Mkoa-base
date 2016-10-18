module.exports = function(app){
    $M.setting={};
    var db = $F.low('setting/lib.json');
    var db2 = $F.low('setting/dictionary.json');

    $M.setting['getConfig']=function *(configKey){
        var cdata=db(configKey).first();
        if(cdata){
            return cdata;
        }else{
            var res = yield $D('settingConfig').findOne({where:{key:configKey}}, {raw: true});
            var curData={};
            var listData=JSON.parse(res.content);
            $F._.each(listData,function(el, index, list){
                curData[el.key]=el.value;
            });
            db(configKey).push(curData);
            return curData;
        }
    };

    $M.setting['delConfig']=function *(configKey){
        delete db.object[configKey];
    };
    $M.setting['getDictionary']=function *(configKey){
        var cdata=db2(configKey).first();
        if(cdata){
            return cdata;
        }else{
            var res = yield $D('settingDictionary').findOne({where:{key:configKey}}, {raw: true});
            var curData={};
            var listData=JSON.parse(res.content);
            $F._.each(listData,function(el, index, list){
                curData[el.value]=el.name;
            });
            db2(configKey).push(curData);
            return curData;
        }
    };

    $M.setting['delDictionary']=function *(configKey){
        delete db2.object[configKey];
    }
};
