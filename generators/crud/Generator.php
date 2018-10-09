<?php
namespace zh\gii\generators\crud;

use yii\gii\generators\crud\Generator as YiiGenerator;
use yii\db\ActiveRecord;

class Generator extends YiiGenerator
{
    public $dilimiter = ';';
    //忽略列表
    public $ignoreAttribute = [
        'sort','status'
    ];
    
    //单图
    public $imageFlag = ['image'];
    
    //排序
    public $sortFlag = ['sort'];
    
    /**
     * @return string[]
     */    
    public function getIgnoreAttribute()
    {
        return $this->ignoreAttribute;
    }
    
    /**
     * get table comments
     * @return string
     */
    public function getTableComments()
    {
        $tableName = $this->getTableSchema()->name;
        $sql = "show table status like '$tableName'";
        $connection = ActiveRecord::getDb();
        $command = $connection->createCommand($sql);
        $result = $command->queryOne();
        return $result['Comment'] ?? $result['Name'];
    }
}
