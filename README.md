# Installation

## Install With Composer


执行
~~~

composer require zsd/yii2-gii-h

~~~

或者按照 dev-master 版本

~~~

composer require zsd/yii2-gii-h dev-master

~~~


下载完毕后修改配置文件

~~~
return [
    ...
    'aliases' => [
        '@zh/gii'=> '@vendor/zsd/yii2-gii-h',
        ...
    ]
];
~~~

配置 `gii` `modules` 

~~~
......

$config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'generators' => [
            'crud' => [
                'class' => 'zh\gii\generators\crud\Generator',
                'templates' => [
                    'zh' => '@vendor/zsd/yii2-gii-h/generators/crud/zh',
                ]
            ],
            'model' => [
                'class' => 'yii\gii\generators\model\Generator',
                'templates' => [
                    'zh' => '@vendor/zsd/yii2-gii-h/generators/model/zh',
                ]
            ],
        ]
    ];
......

return $config;
~~~