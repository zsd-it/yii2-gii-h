<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator yii\gii\generators\crud\Generator */

$urlParams = $generator->generateUrlParams();
$nameAttribute = $generator->getNameAttribute();
$tableComments = $generator->getTableComments();
echo "<?php\n";
?>

use yii\helpers\Html;
use <?= $generator->indexWidgetType === 'grid' ? "yii\\grid\\GridView" : "yii\\widgets\\ListView" ?>;
<?= $generator->enablePjax ? 'use yii\widgets\Pjax;' : '' ?>

/* @var $this yii\web\View */
<?= !empty($generator->searchModelClass) ? "/* @var \$searchModel " . ltrim($generator->searchModelClass, '\\') . " */\n" : '' ?>
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = '<?= $tableComments.'列表' ?>';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="<?= Inflector::camel2id(StringHelper::basename($generator->modelClass)) ?>-index col-sm-12" style="margin-top: 15px;">
    <p>
        <?= "<?= " ?>Html::a(<?= $generator->generateString('创建' . $tableComments) ?>, ['create'], ['class' => 'btn btn-success']) ?>
    </p>
<div class="ibox ibox-content">
<?php if(!empty($generator->searchModelClass)): ?>
<?= "    <?php " . ($generator->indexWidgetType === 'grid' ? " " : "") ?>echo $this->render('_search', ['model' => $searchModel]); ?>
<?php endif; ?>


<?= $generator->enablePjax ? '<?php Pjax::begin(); ?>'."\n" : '' ?>
<?php if ($generator->indexWidgetType === 'grid'): ?>
    <?= "<?= " ?>GridView::widget([
        'dataProvider' => $dataProvider,
        'tableOptions' => ['class' => 'table table-striped'],
        <?= !empty($generator->searchModelClass) ? "//'filterModel' => \$searchModel,\n        'columns' => [\n" : "'columns' => [\n"; ?>
            //['class' => 'yii\grid\SerialColumn'],

<?php
$count = 0;
if (($tableSchema = $generator->getTableSchema()) === false) {
    foreach ($generator->getColumnNames() as $name) {
        if (++$count < 6) {
            echo "            '" . $name . "',\n";
        } else {
            echo "            // '" . $name . "',\n";
        }
    }
} else {
    foreach ($tableSchema->columns as $column) {
        $format = $generator->generateColumnFormat($column);
        $str = "            '" . $column->name . ($format === 'text' ? "" : ":" . $format) . "',\n";
        $comment = $column->comment;
        if ($comment && ($arr = explode(';', $comment))) {
            $type = isset($arr[1]) ? $arr[1] : false;
            if (in_array($type, $generator->sortFlag)) {
                $str = <<<PHP
            [
                'attribute' => '$column->name',
                'class' => zh\\edit\InputEdit::className(),
                'options' => [
                    'style'=>'width:50px'
                ]
            ],

PHP;
            }
            elseif (in_array($type, $generator->imageFlag)) {
                    $str = <<<PHP
            [
                'headerOptions' => ['width'=>'100px'],
                'attribute' => '$column->name',
                'class' => zh\images\ViewImages::className(),
            ],

PHP;
            }
            
        }
        echo $str;
    }
}
?>
            [
                'class' => 'yii\grid\ActionColumn',
                'header' => '操作',
                'headerOptions' => ['width'=>'150px'],
                'template' => '{view} {update} {delete}',
                'buttons' => [
                    'view' => function($url, $model, $key){
                        return Html::a('查看', $url,['class' =>'btn btn-outline btn-default btn-xs']);
                    },
                    'update' => function($url, $model, $key){
                    	return Html::a('修改', $url,['class' =>'btn btn-outline btn-info btn-xs']);
                   	},
                    'delete' => function($url, $model, $key){
                       	return Html::a('删除', $url,['data-confirm' => '你确定要删除吗?','data-method' => 'POST','class' =>'btn btn-outline btn-danger btn-xs']);
                   	},
               ],
            ],
        ],
    ]); ?>
<?php else: ?>
    <?= "<?= " ?>ListView::widget([
        'dataProvider' => $dataProvider,
        'itemOptions' => ['class' => 'item'],
        'itemView' => function ($model, $key, $index, $widget) {
            return Html::a(Html::encode($model-><?= $nameAttribute ?>), ['view', <?= $urlParams ?>]);
        },
    ]) ?>
<?php endif; ?>
<?= $generator->enablePjax ? '<?php Pjax::end(); ?>' : '' ?>
	</div>
</div>